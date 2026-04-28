import { Payment, Booking, Bus } from "../models/index.js";
import { asyncHandler, createError } from "../middleware/errorMiddleware.js";
import {
  notifyPaymentConfirmed,
  notifyPaymentFailed,
} from "../services/notificationService.js";
import paypackService from "../services/paypackService.js";
import QRCode from "qrcode";
import crypto from "crypto";
import { Op } from "sequelize";

/**
 * Initiate a mobile-money payment for a booking via PayPack.
 * The caller's phone number receives a USSD push (cashin) request.
 *
 * POST /payments/initiate
 * Body: { bookingId, phoneNumber, amount }
 */
export const initiatePayment = asyncHandler(async (req, res) => {
  const { bookingId, phoneNumber, amount } = req.body;
  const userId = req.user.id;

  // ── 1. Validate booking ───────────────────────────────────────────────────
  const booking = await Booking.findByPk(bookingId, {
    include: [
      {
        model: Bus,
        as: "bus",
        attributes: ["id", "plateNumber", "departureDate", "departureTime"],
      },
    ],
  });

  if (!booking) {
    throw createError.notFound("Booking not found");
  }

  if (booking.passengerId !== userId) {
    throw createError.forbidden("You can only pay for your own bookings");
  }

  if (booking.status === "cancelled") {
    throw createError.badRequest("Cannot pay for a cancelled booking");
  }

  if (booking.status === "confirmed") {
    throw createError.conflict(
      "This booking has already been paid and confirmed",
    );
  }

  // ── 2. Guard against duplicate pending / completed payments ───────────────
  const existingPayment = await Payment.findOne({
    where: {
      bookingId,
      status: { [Op.in]: ["pending", "completed"] },
    },
  });

  if (existingPayment) {
    if (existingPayment.status === "completed") {
      throw createError.conflict("Payment already completed for this booking");
    }
    // Return the existing pending payment so the client can poll its status
    return res.status(200).json({
      status: 200,
      message: "A pending payment already exists for this booking",
      data: {
        payment: {
          id: existingPayment.id,
          bookingId: existingPayment.bookingId,
          amount: existingPayment.amount,
          status: existingPayment.status,
          paypackRef: existingPayment.paypackRef,
          phoneNumber: existingPayment.phoneNumber,
          createdAt: existingPayment.createdAt,
        },
      },
    });
  }

  // ── 3. Determine payment amount ───────────────────────────────────────────
  const paymentAmount = Number(amount);

  // ── 4. Trigger PayPack cashin ─────────────────────────────────────────────
  let paypackResponse;
  try {
    paypackResponse = await paypackService.initiateCashin(
      phoneNumber,
      paymentAmount,
    );
  } catch (paypackError) {
    console.error(
      "[initiatePayment] PayPack cashin failed:",
      paypackError.message,
    );
    throw createError.internal(
      "Failed to initiate mobile money payment. Please try again later.",
    );
  }

  // ── 5. Persist payment record ─────────────────────────────────────────────
  const payment = await Payment.create({
    bookingId,
    amount: paymentAmount,
    status: "pending",
    paypackRef: paypackResponse.ref,
    phoneNumber,
    qrCodeToken: null, // QR is generated only after payment is confirmed
  });

  res.status(201).json({
    status: 201,
    message:
      "Payment initiated. Please approve the mobile money request on your phone.",
    data: {
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount,
        status: payment.status,
        paypackRef: payment.paypackRef,
        phoneNumber: payment.phoneNumber,
        createdAt: payment.createdAt,
      },
      instructions:
        "Check your phone for a mobile money prompt and enter your PIN to complete payment. " +
        "Then call GET /payments/" +
        payment.id +
        "/status to confirm.",
    },
  });
});

/**
 * Poll PayPack for the real-time status of a pending payment and update the DB.
 * On success the booking is confirmed and a QR boarding-pass is generated.
 *
 * GET /payments/:id/status
 */
export const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ── 1. Load payment ───────────────────────────────────────────────────────
  const payment = await Payment.findByPk(id, {
    include: [
      {
        model: Booking,
        as: "booking",
        attributes: ["id", "passengerId", "busId", "seatNumber", "status"],
      },
    ],
  });

  if (!payment) {
    throw createError.notFound("Payment not found");
  }

  // ── 2. Authorisation ──────────────────────────────────────────────────────
  const isOwner = payment.booking.passengerId === req.user.id;
  const isAdminOrSupervisor =
    req.user.role === "Admin" || req.user.role === "Supervisor";

  if (!isOwner && !isAdminOrSupervisor) {
    throw createError.forbidden("Access denied");
  }

  // ── 3. Short-circuit if already finalised ─────────────────────────────────
  if (payment.status === "completed") {
    return res.status(200).json({
      status: 200,
      message: "Payment already completed",
      data: _buildStatusResponse(payment),
    });
  }

  if (payment.status === "failed") {
    return res.status(200).json({
      status: 200,
      message: "Payment has failed",
      data: _buildStatusResponse(payment),
    });
  }

  // ── 4. Payment must have a PayPack ref ───────────────────────────────────
  if (!payment.paypackRef) {
    throw createError.badRequest(
      "This payment has no PayPack reference and cannot be polled. Use /payments/verify instead.",
    );
  }

  // ── 5. Poll PayPack ───────────────────────────────────────────────────────
  let paypackStatus;
  try {
    paypackStatus = await paypackService.checkPaymentStatus(payment.paypackRef);
  } catch (paypackError) {
    console.error(
      "[checkPaymentStatus] PayPack poll failed:",
      paypackError.message,
    );
    throw createError.internal(
      "Failed to reach PayPack to check payment status. Please try again shortly.",
    );
  }

  // ── 6. Still pending — nothing to update yet ──────────────────────────────
  if (paypackStatus.status === "pending") {
    return res.status(200).json({
      status: 200,
      message:
        "Payment is still pending. Please approve the mobile money request on your phone.",
      data: _buildStatusResponse(payment, paypackStatus),
    });
  }

  const booking = payment.booking;

  // ── 7. Payment successful ─────────────────────────────────────────────────
  if (paypackStatus.status === "successful") {
    // Generate a unique QR boarding-pass token
    const qrCodeToken = crypto.randomBytes(32).toString("hex");

    payment.status = "completed";
    payment.qrCodeToken = qrCodeToken;
    await payment.save();

    booking.status = "confirmed";
    await booking.save();

    // Generate QR data URL for boarding
    const qrPayload = JSON.stringify({
      paymentId: payment.id,
      bookingId: booking.id,
      amount: payment.amount,
      token: qrCodeToken,
    });
    const qrCodeDataURL = await QRCode.toDataURL(qrPayload);

    // Notify passenger
    await notifyPaymentConfirmed(booking.passengerId, booking.id);

    return res.status(200).json({
      status: 200,
      message: "Payment confirmed! Your booking is now confirmed.",
      data: {
        ..._buildStatusResponse(payment, paypackStatus),
        qrCode: qrCodeDataURL,
        qrCodeToken,
      },
    });
  }

  // ── 8. Payment failed ─────────────────────────────────────────────────────
  payment.status = "failed";
  await payment.save();

  await notifyPaymentFailed(booking.passengerId, booking.id);

  return res.status(200).json({
    status: 200,
    message: "Payment failed. Please initiate a new payment.",
    data: _buildStatusResponse(payment, paypackStatus),
  });
});

/**
 * Verify a completed payment using its QR boarding-pass token.
 * Used by drivers / supervisors at boarding to validate a passenger's ticket.
 *
 * POST /payments/verify
 * Body: { paymentId, qrCodeToken }
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, qrCodeToken } = req.body;

  const payment = await Payment.findByPk(paymentId, {
    include: [
      {
        model: Booking,
        as: "booking",
        attributes: ["id", "passengerId", "busId", "seatNumber", "status"],
      },
    ],
  });

  if (!payment) {
    throw createError.notFound("Payment not found");
  }

  // Must be a completed payment to board
  if (payment.status !== "completed") {
    throw createError.badRequest(
      `Payment is not completed (current status: ${payment.status}). Boarding denied.`,
    );
  }

  // Verify the QR token
  if (payment.qrCodeToken !== qrCodeToken) {
    throw createError.badRequest("Invalid QR code token. Boarding denied.");
  }

  res.status(200).json({
    status: 200,
    message: "Ticket verified successfully. Passenger may board.",
    data: {
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount,
        status: payment.status,
      },
      booking: {
        id: payment.booking.id,
        seatNumber: payment.booking.seatNumber,
        status: payment.booking.status,
      },
    },
  });
});

/**
 * Get payment details by ID.
 *
 * GET /payments/:id
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findByPk(id, {
    include: [
      {
        model: Booking,
        as: "booking",
        attributes: ["id", "passengerId", "busId", "seatNumber", "status"],
      },
    ],
  });

  if (!payment) {
    throw createError.notFound("Payment not found");
  }

  // Check access permissions
  const isOwner = payment.booking.passengerId === req.user.id;
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    throw createError.forbidden("Access denied");
  }

  res.status(200).json({
    status: 200,
    message: "Payment retrieved successfully",
    data: {
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount,
        status: payment.status,
        paypackRef: payment.paypackRef,
        phoneNumber: payment.phoneNumber,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    },
  });
});

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Build a standardised status payload from a payment record and optional
 * raw PayPack status data.
 */
function _buildStatusResponse(payment, paypackStatus = null) {
  return {
    payment: {
      id: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
      paypackRef: payment.paypackRef,
      phoneNumber: payment.phoneNumber,
      updatedAt: payment.updatedAt,
    },
    ...(paypackStatus && {
      paypack: {
        eventKind: paypackStatus.eventKind,
        rawStatus: paypackStatus.status,
      },
    }),
  };
}
