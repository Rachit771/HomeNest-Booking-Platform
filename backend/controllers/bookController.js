const {createBooking,confirmBooking,cancelBooking}=require('../Service/service') 
exports.createBookingController=async (req,res)=>{
  try{
    const {userId, homeId, startDate, endDate}=req.body;
    const booking=await createBooking(userId, homeId, startDate, endDate);
    res.status(201).json({'message':'Booking Created Succesfully',booking})
  }
  catch{
    res.status(500).json({'message':'Internal server error'})
  }
}
exports.cancelBookingController=async (req,res)=>{
  try{
    const id=req.params.id;
    const booking=await cancelBooking(id);
    res.status(200).json({'message':'Cancelled Succesfully',booking})
  }
  catch{
    res.status(500).json({'message':'Internal server error'})
  }
}
exports.confirmBookingController=async (req,res)=>{
  try{
    const id=req.params.id;
    const booking=await confirmBooking(id);
    res.status(200).json({'message':'Booked Succesfully',booking})
  }
  catch{
    res.status(500).json({'message':'Internal server error'})
  }
}
