const express=require('express');
const {confirmBookingController,cancelBookingController,createBookingController}=require('../controllers/bookController')
const bokingRoute=express.Router();
bookingRoute.post('/',createBookingController);
bookingRoute.patch('/confirm/:id',confirmBookingController);
bookingRoute.patch('/cancel/:id',cancelBookingController);