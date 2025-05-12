const express=require('express');
const {User}=require('../models/User')
const router=express.Router()
const nodemailer=require('nodemailer')
const otpStore=require('../otpstore.js')
require('dotenv').config();


// router.post('/forgotPassword',async(req,res)=>{
//     const {email}=req.body;
//     const user=await User.findOne({email});
//     try{
//     if(!user)
//     {
//         return res.status(400).json({success:false,message:"Email not found"});

//     }

//     const otp = Math.floor(1000 + Math.random() * 9000);  
//       // const expirationTime = Date.now() + 5 * 60 * 1000; 
//       const expirationTime = Date.now() + 2 * 60 * 1000;  // Modified: 2 minutes

      
//       otpStore[email] = { otp, expires: expirationTime };  
  
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL,  
//           pass: process.env.PASSWORD, 
//         },
//       });
  
//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Your OTP for Password Reset',
//         text: `Your OTP is ${otp}`,
//       };
  
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
          
//           return res.status(500).json({ success: false, message: 'Failed to send OTP' });
//         }
//         res.status(200).json({success: true, message: 'OTP sent successfully' });
//       });
    
    
// }catch(error)
// {
//     res.status(500).json({ success: false, message: 'Server error',error: error.message });

// }
// })

// module.exports=router



router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
     try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Email not found' });
      }
  
      const otp = Math.floor(1000 + Math.random() * 9000);  
      // const expirationTime = Date.now() + 5 * 60 * 1000; 
      const expirationTime = Date.now() + 2 * 60 * 1000;  // Modified: 2 minutes

      
      otpStore[email] = { otp, expires: expirationTime };  
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,  
          pass: process.env.PASSWORD, 
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          
          return res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
        res.status(200).json({success: true, message: 'OTP sent successfully' });
      });
    } catch (error) {
      
      res.status(500).json({ success: false, message: 'Server error',error: error.message });
    }
});

module.exports = router;
