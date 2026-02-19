const express=require('express');
const {confirmBookingController,cancelBookingController,createBookingController,getBookingPage,getUserBookings}=require('../controllers/bookController')
const bookingRoute=express.Router();
bookingRoute.get("/book/:id", getBookingPage);
bookingRoute.post('/book/:id',createBookingController);
bookingRoute.get("/bookings", getUserBookings);
bookingRoute.patch('/confirm/:id',confirmBookingController);
bookingRoute.patch('/cancel/:id',cancelBookingController);
module.exports=bookingRoute;