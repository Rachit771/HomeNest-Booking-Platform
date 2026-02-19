const mongoose = require('mongoose');
const Booking = require('../Model/Booking');

async function createBooking(userId, homeId, startDate, endDate) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  IMPORTANT: pass session to queries
     const now = new Date();
    const conflict = await Booking.findOne({
      homeId,
     $or: [
    { status: "CONFIRMED" },
    { status: "PAYMENT_PENDING", expiresAt: { $gt: now } } //"Only include bookings whose expiration time is still in the future."
  ],
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    }).session(session);

    if (conflict) {
      throw new Error('Home already booked');
    }

    const booking = await Booking.create([{
      userId,
      homeId,
      startDate,
      endDate,
      status: 'PAYMENT_PENDING',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) //  // Booking expires in 15 minutes
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return booking[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
   finally {
  session.endSession();
}
}
async function confirmBooking(bookingId, userId) {
  const now = new Date();

  // 1️  atomic state transition
  const result = await Booking.updateOne(
    {
      _id: bookingId,
      userId,
      status: "PAYMENT_PENDING",
      expiresAt: { $gt: now } // not expired
    },
    {
      $set: { status: "CONFIRMED" },
      $unset: { expiresAt: "" }
    }
  );

  // 2️ If successfully modified → first confirmation
  if (result.modifiedCount === 1) {
    return await Booking.findById(bookingId);
  }

  // 3️ If not modified, check current state
  const booking = await Booking.findOne({
    _id: bookingId,
    userId
  });

  if (!booking) {
    throw new Error("Booking not found or unauthorized");
  }

  // 4️ Idempotent success (already confirmed)
  if (booking.status === "CONFIRMED") {
    return booking;
  }

  // 5️ Cannot confirm cancelled booking
  if (booking.status === "CANCELLED") {
    throw new Error("Booking already cancelled");
  }

  // 6️ Expired booking
  if (
    booking.status === "PAYMENT_PENDING" &&
    booking.expiresAt <= now
  ) {
    throw new Error("Booking expired");
  }

  // 7️ Any other unexpected state
  throw new Error("Booking cannot be confirmed");
}

async function cancelBooking(bookingId, userId) {
 const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      userId: userId,
      status: { $in: ["CONFIRMED", "PAYMENT_PENDING"] }
    },
    {
      $set: { status: "CANCELLED" }
    },
    { new: true }
  );

  if (!booking) {
    throw new Error("Booking cannot be cancelled");
  }

  return booking;

}


module.exports={createBooking,confirmBooking,cancelBooking}

