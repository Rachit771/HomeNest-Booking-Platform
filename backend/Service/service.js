const mongoose = require('mongoose');
const Booking = require('../Model/Booking');

async function createBooking(userId, homeId, startDate, endDate) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  IMPORTANT: pass session to queries

    const conflict = await Booking.findOne({
      homeId,
     $or: [
    { status: "CONFIRMED" },
    { status: "PAYMENT_PENDING", expiresAt: { $gt: now } }
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
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) 
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
async function confirmBooking(bookingId){
  const booking=  await Booking.findOneAndUpdate(
      {_id:bookingId,status:"PAYMENT_PENDING"},                        //filter
      {$set:{status:"CONFIRMED"},
      $unset: { expiresAt: "" }},                                   //Update
      {new:true}                                                     //new:true will return updated document
    )
  if(!booking) {
    throw new Error("Booking cannot be confirmed");
  }
  return booking;
}
async function cancelBooking(bookingId){
  const booking=await Booking.findOneAndUpdate(
    {_id:bookingId,status:"CONFIRMED"},
    {$set:{status:"CANCELLED"}},
    {new:true}
  )
    if(!booking) {
    throw new Error("Booking cannot be Cancelled");
  }
  return booking;
}

module.exports={createBooking}

