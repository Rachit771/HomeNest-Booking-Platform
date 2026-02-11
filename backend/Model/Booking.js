const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "endDate must be after startDate"
    }
  },
  status: {
    type: String,
    enum: [
      "PAYMENT_PENDING",
      "CONFIRMED",
      "CANCELLED",
    ],
    default: "PAYMENT_PENDING"
  },
  expiresAt: {type:Date}
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
