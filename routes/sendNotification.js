






  const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); // Make sure this is properly initialized
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');

// router.post('/send-notification', authentiCate, async (req, res) => {
 
//     try {
//         const { toUserId, title, body, targetUserId } = req.body;
        
//         // Get FCM token for the target user
//         const targetUser = await User.findById(toUserId);
        
//         if (!targetUser || !targetUser.fcmToken) {
//           return res.status(404).json({ message: "User not found or no FCM token available" });
//         }
        
//         // Create the message payload
//         const message = {
//           notification: {
//             title: title,
//             body: body,
//           },
//           data: {
//             // Include targetUserId to help client filter notifications
//             targetUserId: targetUserId || toUserId,
//             screen: 'sendbooking', // Or appropriate screen based on notification type
//           },
//           token: targetUser.fcmToken,
//         };
        
//         // Send the notification through Firebase
//         const response = await admin.messaging().send(message);
        
//         res.status(200).json({ 
//           success: true, 
//           message: "Notification sent successfully",
//           messageId: response 
//         });
//       } catch (error) {
//         console.error("Error sending notification:", error);
//         res.status(500).json({ message: "Failed to send notification", error: error.message });
//       }
// })
// module.exports = router;



router.post('/send-notification', authentiCate, async (req, res) => {
  try {
      const { toUserId, title, body, targetUserId, screen, roomId, senderId } = req.body;
      
      // Get FCM token for the target user
      const targetUser = await User.findById(toUserId);
      
      if (!targetUser || !targetUser.fcmToken) {
        return res.status(404).json({ message: "User not found or no FCM token available" });
      }
      
      // Create the message payload - include all navigation data
      const message = {
        notification: {
          title: title,
          body: body,
        },
        data: {
          // Include targetUserId to help client filter notifications
          targetUserId: targetUserId || toUserId,
          screen: screen || 'sendbooking', // Default if not specified
          // Add these for ChatScreen navigation - convert to strings since FCM data must be strings
          ...(roomId && { roomId: roomId.toString() }),
          ...(senderId && { senderId: senderId.toString() })
        },
        token: targetUser.fcmToken,
      };
      
      // Send the notification through Firebase
      const response = await admin.messaging().send(message);
      
      res.status(200).json({ 
        success: true, 
        message: "Notification sent successfully",
        messageId: response 
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification", error: error.message });
    }
});

module.exports=router

