const {createBooking,confirmBooking,cancelBooking}=require('../Service/service') 
exports.createBookingController = async (req, res) => {
  try {
    const { homeId, startDate, endDate } = req.body;

    const booking = await createBooking(
      req.session.user._id, // NEVER trust body for userId
      homeId,
      startDate,
      endDate
    );

    return res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || "Failed to create booking"
    });
  }
};

exports.cancelBookingController = async (req, res) => {
  try {
    const booking = await cancelBooking(
      req.params.id,
      req.session.user._id
    );

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || "Failed to cancel booking"
    });
  }
};

exports.confirmBookingController = async (req, res) => {
  try {
    const booking = await confirmBooking(
      req.params.id,
      req.session.user._id
    );

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || "Failed to confirm booking"
    });
  }
};
