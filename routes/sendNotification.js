






  const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); // Make sure this is properly initialized
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');

router.post('/send-notification', authentiCate, async (req, res) => {
 
    try {
        const { toUserId, title, body, targetUserId } = req.body;
        
        // Get FCM token for the target user
        const targetUser = await User.findById(toUserId);
        
        if (!targetUser || !targetUser.fcmToken) {
          return res.status(404).json({ message: "User not found or no FCM token available" });
        }
        
        // Create the message payload
        const message = {
          notification: {
            title: title,
            body: body,
          },
          data: {
            // Include targetUserId to help client filter notifications
            targetUserId: targetUserId || toUserId,
            screen: 'sendbooking', // Or appropriate screen based on notification type
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
})
module.exports = router;



// router.post('/send-notification', authentiCate, async (req, res) => {
//   try {
//     const { toUserId, title, body, targetUserId, screen = 'sendbooking' } = req.body;
    
//     // Get FCM token for the target user
//     const targetUser = await User.findById(toUserId);
    
//     if (!targetUser || !targetUser.fcmToken) {
//       return res.status(404).json({ 
//         message: "User not found or no FCM token available",
//         userFound: !!targetUser,
//         tokenFound: !!(targetUser && targetUser.fcmToken)
//       });
//     }
    
//     // Create the message payload with both notification and data fields
//     const message = {
//       notification: {
//         title: title || 'New Notification',
//         body: body || 'You have a new update',
//       },
//       data: {
//         // Include targetUserId to help client filter notifications
//         targetUserId: targetUserId || toUserId,
//         screen: screen,
//         title: title || 'New Notification', // Duplicate in data for background handling
//         body: body || 'You have a new update', // Duplicate in data for background handling
//         timestamp: Date.now().toString(),
//       },
//       android: {
//         priority: 'high',
//         notification: {
//           channelId: 'booking_channel',
//           sound: 'default',
//         },
//       },
//       apns: {
//         payload: {
//           aps: {
//             sound: 'default',
//           },
//         },
//       },
//       token: targetUser.fcmToken,
//     };
    
//     console.log(`Sending notification to user ${toUserId} with token: ${targetUser.fcmToken.substring(0, 10)}...`);
    
//     // Send the notification through Firebase
//     const response = await admin.messaging().send(message);
    
//     console.log(`Notification sent successfully: ${response}`);
//     res.status(200).json({
//       success: true,
//       message: "Notification sent successfully",
//       messageId: response
//     });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).json({ message: "Failed to send notification", error: error.message });
//   }
// });

// module.exports = router;