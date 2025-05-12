
// const express = require("express");
// const router = express.Router();
// const { Booking } = require("../models/Booking");
// const { User } = require('../models/User');
// const { authentiCate } = require("../middleware");



// router.get("/bookings/sent", authentiCate, async (req, res) => {
//     try {
//       // Use req.user.userId as that's what you stored in your JWT
//       const bookings = await Booking.find({ requestedBy: req.user.userId })
//         .populate({
//           path: "userId",
//           model: "user", // Using lowercase "user" to match your model registration
//           select: "name email"
//         });
      
//       res.json(bookings);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Server error" });
//     }
//   });

// router.get("/bookings/received", authentiCate, async (req, res) => {
//   try {
//     // Use req.user.userId as that's what you stored in your JWT
//     const bookings = await Booking.find({ userId: req.user.userId })
//       .populate({
//         path: "requestedBy",
//         select: "name email",
//         model: User  // Explicitly specify the model
//       })
//       .lean(); // Convert to plain JS object
    
//     console.log("Found bookings:", bookings); // Debug what's being returned
//     res.json(bookings);
//   } catch (err) {
//     console.error("Error in received bookings:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Accept or reject a booking
// router.patch("/bookings/:id", authentiCate, async (req, res) => {
//   const { status } = req.body; // 'accepted' or 'rejected'
//   if (!["accepted", "rejected"].includes(status)) {
//     return res.status(400).json({ error: "Invalid status" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }
    
//     // Use req.user.userId as that's what you stored in your JWT
//     if (booking.userId.toString() !== req.user.userId.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     booking.status = status;
//     await booking.save();
//     res.json(booking);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { Booking } = require("../models/Booking");
const { User } = require('../models/User');
const { authentiCate } = require("../middleware");
const admin = require('./firebase.js');  // Import Firebase Admin SDK

// Send FCM notification function
// const sendNotification = async (fcmToken, title, message) => {
//   try {
//     const messagePayload = {
//       notification: {
//         title: title,
//         body: message,
//       },
//       token: fcmToken,
//     };

//     // Send the notification
//     await admin.messaging().send(messagePayload);
//     console.log("Notification sent successfully!");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };

router.get("/bookings/sent", authentiCate, async (req, res) => {
    try {
      const bookings = await Booking.find({ requestedBy: req.user.userId })
        .populate({
          path: "userId",
          model: "user",
          select: "name email"
        });
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/bookings/received", authentiCate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate({
        path: "requestedBy",
        select: "name email",
        model: User
      })
      .lean(); 
    
    console.log("Found bookings:", bookings);
    res.json(bookings);
  } catch (err) {
    console.error("Error in received bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Accept or reject a booking
router.patch("/bookings/:id", authentiCate, async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the logged-in user is authorized to change the status
    if (booking.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    // Send FCM notification to the user who made the booking request
    // const requestedByUser = await User.findById(booking.requestedBy);  // Get user who requested the booking
    // if (requestedByUser && requestedByUser.fcmToken) {
    //   const message = `Your booking request has been ${status}`;
    //   await sendNotification(requestedByUser.fcmToken, "Booking Status Update", message);
    // }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
