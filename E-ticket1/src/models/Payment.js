import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "booking_id",
      references: {
        model: "bookings",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refund_pending"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "completed", "failed", "refund_pending"]],
      },
    },
    qrCodeToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "qr_code_token",
    },
    /**
     * PayPack transaction reference returned by initiateCashin.
     * Used to poll the PayPack events API for payment status.
     */
    paypackRef: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "paypack_ref",
    },
    /**
     * Mobile money phone number used for this payment (e.g. 0788123456).
     */
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "phone_number",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [
      {
        fields: ["booking_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["qr_code_token"],
      },
    ],
  },
);

export default Payment;
