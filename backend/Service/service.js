const Booking = require('../Model/Booking');

async function CheckAvailability(homeId, startDate, endDate) {
  const conflict = await Booking.findOne({
    homeId,
    status: { $ne: 'CANCELLED' },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate }
  });

  return !conflict;
}

module.exports = { CheckAvailability };

