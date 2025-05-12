const express=require("express");
const router=express.Router();
const {User}=require('../models/User')
const otpStore=require('../otpstore.js')
const bcrypt = require('bcrypt');
router.post('/resetPassword',async(req,res)=>{
    const {password}=req.body;
    let email = null;
    for (let storedEmail in otpStore) {
      email = storedEmail;
      break; // We just need the first email associated with an OTP
    }
  
    if (!email) {
      return res.status(400).json({ success: false,  message: 'OTP has expired or was not verified' });
    }
  
    try {
      // Find the user by email (from OTP)
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({  success: false,message: 'User not found' });
      }
  
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({  success: false ,message: 'New password must be different from the old password' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
  
      
      delete otpStore[email];
  
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({  success: false , message: 'Server error',error: error.message });
    }
})

module.exports=router