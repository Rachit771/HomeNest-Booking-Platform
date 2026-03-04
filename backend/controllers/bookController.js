const {createBooking,confirmBooking,cancelBooking}=require('../Service/service') 
const Home = require("../Model/homes");
const Booking = require("../Model/Booking");
exports.createBookingController = async (req, res) => {
  try {
    const {startDate, endDate ,guests, requests} = req.body;
    const homeId=req.params.id
    const booking = await createBooking(
      req.session.user._id,
      homeId,
      startDate,
      endDate
    );

    // Redirect to bookings page after success
    res.redirect("/Book/bookings");

  } catch (err) {
    res.status(400).render("404", {
      pageTitle: "Booking Failed",
      currentPage: "Failed to create booking",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};


exports.cancelBookingController = async (req, res) => {
  try {
    await cancelBooking(
      req.params.id,
      req.session.user._id
    );

    res.redirect("/Book/bookings");

  } catch (err) {
     console.log("Cancel Error:", err.message);
    res.status(400).render("404", {
      pageTitle: "Cancel Failed",
      currentPage: "Failed to cancel booking",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};


exports.confirmBookingController = async (req, res) => {
  try {
    await confirmBooking(
      req.params.id,
      req.session.user._id
    );

    res.redirect("/Book/bookings");

  } catch (err) {
    res.status(400).render("404", {
      pageTitle: "Confirm Failed",
      currentPage:"Failed to confirm booking",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.getBookingPage = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);

    if (!home) {
      return res.status(404).render("404");
    }

    res.render("booking/book", {
      home,
      pageTitle: "Book Home",
      currentPage: "Bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    res.status(500).render("404");
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.session.user._id
    })
      .populate("homeId")
      .sort({ createdAt: -1 });

    res.render("booking/bookings-list", {
      bookings,
      pageTitle: "My Bookings",
      currentPage: "Bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    res.status(500).render("404", {
      pageTitle: "Failed to load bookings",
      currentPage: "Bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};
exports.getPaymentPage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("homeId");

    if (!booking) {
      return res.status(404).render("404");
    }

    // security check
    if (booking.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).render("404");
    }

    res.render("booking/payment", {
      booking,
      pageTitle: "Payment",
      currentPage: "Bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    res.status(500).render("404");
  }
};
