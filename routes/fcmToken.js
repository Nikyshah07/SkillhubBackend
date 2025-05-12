


const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');

router.post("/save-fcm-token", authentiCate, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming you have authentication middleware
        const { fcmToken } = req.body;
        
        if (!fcmToken) {
          return res.status(400).json({ message: "FCM token is required" });
        }
        
        // Update user with new FCM token
        await User.findByIdAndUpdate(userId, { fcmToken , lastTokenUpdate: new Date() });
        
        res.status(200).json({ message: "FCM token saved successfully" });
      } catch (error) {
        console.error("Error saving FCM token:", error);
        res.status(500).json({ message: "Failed to save FCM token", error: error.message });
      }
  });
  module.exports=router
  

// const express = require('express');
// const router = express.Router();
// const admin = require('./firebase'); // Import from the centralized firebase.js
// const { User } = require('../models/User');
// const { authentiCate } = require('../middleware');

// // Save FCM token endpoint
// router.post("/save-fcm-token", authentiCate, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { fcmToken } = req.body;
    
//     if (!fcmToken) {
//       return res.status(400).json({ message: "FCM token is required" });
//     }
    
//     // Check if user exists before updating
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
    
//     // Update user with new FCM token
//     await User.findByIdAndUpdate(userId, { fcmToken });
    
//     console.log(`FCM token saved successfully for user ${userId}`);
//     res.status(200).json({ message: "FCM token saved successfully" });
//   } catch (error) {
//     console.error("Error saving FCM token:", error);
//     res.status(500).json({ message: "Failed to save FCM token", error: error.message });
//   }
// });

// module.exports=router