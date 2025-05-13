// const express = require("express");
// const router = express.Router();
// const {User}=require('../models/User')
// const {Booking} = require("../models/Booking");
// const {authentiCate}=require('../middleware')

// // Request a session
// router.post("/booking", authentiCate, async (req, res) => {
//   const { userId, sessionTopic, sessionDate, sessionTime } = req.body;

//   if (!userId || !sessionTopic || !sessionDate || !sessionTime) {
//     return res.status(400).json({ message: "Please provide all session details" });
//   }

//   try {
//     const booking = new Booking({
//       userId,
      
//       sessionTopic,
//       sessionDate,
//       sessionTime,
//     });

//     await booking.save();
//     res.status(201).json({ message: "Session requested successfully", booking });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all bookings for a user


// // Accept/Decline booking


// module.exports = router;


const express = require("express");
const router = express.Router();
const { User } = require('../models/User');

const { Booking } = require("../models/Booking");
const { authentiCate } = require('../middleware');
const sendEmailNotification = require('../utils/nodemailer'); // Import the email helper

// Request a session
router.post("/booking", authentiCate, async (req, res) => {
  const { userId, sessionTopic, sessionDate, sessionTime } = req.body;
  const requester = await User.findById(req.user.userId);
  if (!userId || !sessionTopic || !sessionDate || !sessionTime) {
    return res.status(400).json({ message: "Please provide all session details" });
  }

  try {
    const booking = new Booking({
      userId,
      requestedBy:req.user.userId,
      sessionTopic,
      sessionDate,
      sessionTime,
    });

    await booking.save();

    // Fetch the email of the user who is being booked
    const user = await User.findById(userId);
    if (user) {
      // Send email to the user with the session details
      // const subject = "You have a new session request!";
      // const text = `
      //   Hello ${user.name},
        
      //   You have received a session requestfrom ${requester.name} for the topic: ${sessionTopic}
      //   Scheduled on: ${sessionDate} at ${sessionTime}
        
      //   Please log in to your account to review and respond to the request.
      // `;
      // sendEmailNotification(user.email, subject, text); // Send the email

      const subject = "You have a new session request!";
const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50;">New Session Request</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>You have received a session request from <strong>${requester.name}</strong>.</p>
      <p><strong>Topic:</strong> ${sessionTopic}<br/>
         <strong>Date:</strong> ${sessionDate}<br/>
         <strong>Time:</strong> ${sessionTime}
      </p>
      <p>Please log in to your account to review and respond to the request.</p>
      <br/>
      <p style="color: #888;">Thanks,<br/>The Team</p>
    </div>
  </div>
`;

sendEmailNotification(user.email, subject, html); // Send email with HTML

    }
console.log(requester.name)
    res.status(201).json({ message: "Session requested successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports=router