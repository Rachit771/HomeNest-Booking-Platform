const mongoose = require('mongoose');
const Booking = require('../Model/Booking');

async function createBooking(userId, homeId, startDate, endDate) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  IMPORTANT: pass session to queries

    const conflict = await Booking.findOne({
      homeId,
      status: { $ne: 'CANCELLED' },
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
      status: 'PAYMENT_PENDING'
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
module.exports={createBooking}

