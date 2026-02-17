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
// For availability check (most critical query)
BookingSchema.index({ homeId: 1, startDate: 1, endDate: 1, status: 1 });

// For expiry-based queries (if you later clean expired bookings)
BookingSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("Booking", BookingSchema);
