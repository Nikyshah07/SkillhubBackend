const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const {Booking}=require('../models/Booking');
const { authentiCate } = require('../middleware');

router.delete('/deletebooking/:bookingId',authentiCate,async(req,res)=>{
    const userId=req.user.userId;
    const bookingId=req.params.bookingId;
try{
    const booking=await Booking.findById(bookingId)
if (
    booking.status !== 'rejected' 
   
  ) {
    return res.status(403).json({ message: 'Not allowed to delete this booking' });
  }

  await Booking.findByIdAndDelete(bookingId);

 return res.json({ message: 'Booking deleted successfully' });
}
 catch (error) {
  console.error('Error deleting booking:', error);
 return res.status(500).json({ message: 'Server error' });
}

})

module.exports=router