import { body, param } from "express-validator";

/**
 * Validation rules for initiating a PayPack mobile money payment
 */
export const initiatePaymentValidation = [
  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isInt({ min: 1 })
    .withMessage("Booking ID must be a positive integer"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^(\+?25)?07[0-9]{8}$/)
    .withMessage(
      "Phone number must be a valid Rwandan mobile number " +
        "(e.g. 0788123456, 250788123456, or +250788123456)",
    ),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 1 })
    .withMessage("Amount must be a positive number"),
];

/**
 * Validation rules for checking PayPack payment status by payment ID
 */
export const checkPaymentStatusValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Payment ID must be a positive integer"),
];

/**
 * Validation rules for verifying a payment (QR code boarding check)
 */
export const verifyPaymentValidation = [
  body("paymentId")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isInt({ min: 1 })
    .withMessage("Payment ID must be a positive integer"),

  body("qrCodeToken")
    .notEmpty()
    .withMessage("QR code token is required")
    .isString()
    .withMessage("QR code token must be a string"),
];

/**
 * Validation rules for payment ID parameter
 */
export const paymentIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Payment ID must be a positive integer"),
];
