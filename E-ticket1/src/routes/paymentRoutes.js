import express from "express";
import {
  initiatePayment,
  verifyPayment,
  checkPaymentStatus,
  getPaymentById,
} from "../controllers/paymentController.js";
import {
  initiatePaymentValidation,
  verifyPaymentValidation,
  paymentIdValidation,
} from "../validators/paymentValidators.js";
import { handleValidationErrors } from "../middleware/validationMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

/**
 * @route   POST /payments/initiate
 * @desc    Initiate a PayPack mobile money payment for a booking
 * @access  Authenticated users (Passenger)
 * @body    { bookingId: number, phoneNumber: string, amount: number }
 */
router.post(
  "/initiate",
  initiatePaymentValidation,
  handleValidationErrors,
  initiatePayment,
);

/**
 * @route   POST /payments/verify
 * @desc    Verify payment with QR code token (used at boarding gate)
 * @access  Authenticated users (Driver, Supervisor)
 */
router.post(
  "/verify",
  verifyPaymentValidation,
  handleValidationErrors,
  verifyPayment,
);

/**
 * @route   GET /payments/:id/status
 * @desc    Poll PayPack for the latest payment status and update the DB accordingly
 * @access  Owner, Admin
 */
router.get(
  "/:id/status",
  paymentIdValidation,
  handleValidationErrors,
  checkPaymentStatus,
);

/**
 * @route   GET /payments/:id
 * @desc    Get payment by ID
 * @access  Owner, Admin
 */
router.get("/:id", paymentIdValidation, handleValidationErrors, getPaymentById);

export default router;
