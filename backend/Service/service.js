const Booking = require('../Model/Booking');

/**
 * Internal helper — can still be exported if you want
 */
async function CheckAvailability(homeId, startDate, endDate) {
  const conflict = await Booking.findOne({
    homeId,
    status: { $ne: 'CANCELLED' },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  });

  return !conflict;
}

async function createBooking(userId, homeId, startDate, endDate) {
  // 👇 availability check happens INSIDE booking creation
  const isAvailable = await CheckAvailability(homeId, startDate, endDate);

  if (!isAvailable) {
    throw new Error('Home already booked for selected dates');
  }

  return await Booking.create({
    userId,
    homeId,
    startDate,
    endDate,
    status: 'PAYMENT_PENDING',
  });
}

module.exports = {
  createBooking,
  CheckAvailability, // optional export
};


