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
}
async function confirmBooking(bookingId,userId){
  const booking=  await Booking.findOneAndUpdate(
      {_id:bookingId,userId,status:"PAYMENT_PENDING",expiresAt: { $gt: new Date() }},                        //filter
      {$set:{status:"CONFIRMED"},
      $unset: { expiresAt: "" }},                                   //Update
      {new:true}                                                     //new:true will return updated document
    )
  if(!booking) {
    throw new Error("Booking cannot be confirmed");
  }
  return booking;
}
async function cancelBooking(bookingId, userId) {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      userId,
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

