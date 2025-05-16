// const express = require('express');
// const router = express.Router();
// const { Message } = require('../models/Message');

// // POST: Store message
// router.post('/messages', async (req, res) => {
//   try {
//     const { roomId, senderId, receiverId, content } = req.body;
//     const newMessage = new Message({ roomId, senderId, receiverId, content });
//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save message' });
//   }
// });

// // GET: Get messages by room ID
// // router.get('/messages/:roomId', async (req, res) => {
// //   try {
// //     const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
// //     res.status(200).json(messages);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch messages' });
// //   }
// // });


// router.get('/messages/:roomId', async (req, res) => {
//     try {
//       const messages = await Message.find({ roomId: req.params.roomId })
//         .sort({ timestamp: 1 })
//         .lean(); // Use lean() for better performance
      
//       console.log(`Returning ${messages.length} messages for room ${req.params.roomId}`);
//       res.status(200).json(messages);
//     } catch (err) {
//       console.error('Failed to fetch messages:', err);
//       res.status(500).json({ error: 'Failed to fetch messages' });
//     }
//   });

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { Message } = require('../models/Message');

// // POST: Store message
// router.post('/messages', async (req, res) => {
//   try {
//     const { roomId, senderId, receiverId, content, _tempId } = req.body;
    
//     // Check if a message with the same content was recently sent (within last 5 seconds)
//     // This helps prevent duplicate messages when network issues occur
//     const recentlyCreated = await Message.findOne({
//       roomId,
//       senderId,
//       content,
//       timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
//     });
    
//     if (recentlyCreated) {
//       console.log(`Duplicate message detected with tempId: ${_tempId}`);
//       return res.status(200).json({
//         ...recentlyCreated.toObject(),
//         _tempId
//       });
//     }
    
//     const newMessage = new Message({ roomId, senderId, receiverId, content });
//     const savedMessage = await newMessage.save();
    
//     // Return the message with the tempId included for client-side matching
//     res.status(201).json({
//       ...savedMessage.toObject(),
//       _tempId
//     });
//   } catch (err) {
//     console.error('Failed to save message:', err);
//     res.status(500).json({ error: 'Failed to save message' });
//   }
// });

// // GET: Get messages by room ID
// router.get('/messages/:roomId', async (req, res) => {
//   try {
//     const messages = await Message.find({ roomId: req.params.roomId })
//       .sort({ timestamp: 1 })
//       .lean(); // Use lean() for better performance
    
//     // Apply unique IDs check on the server side
//     const uniqueIds = new Set();
//     const uniqueMessages = messages.filter(msg => {
//       if (uniqueIds.has(msg._id.toString())) {
//         return false;
//       }
//       uniqueIds.add(msg._id.toString());
//       return true;
//     });
    
//     console.log(`Returning ${uniqueMessages.length} messages for room ${req.params.roomId}`);
//     res.status(200).json(uniqueMessages);
//   } catch (err) {
//     console.error('Failed to fetch messages:', err);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');

// POST: Store message
router.post('/messages', async (req, res) => {
  try {
    const { roomId, senderId, receiverId, content, _tempId } = req.body;
    
    // Check if a message with the same content was recently sent (within last 5 seconds)
    const recentlyCreated = await Message.findOne({
      roomId,
      senderId,
      content,
      timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
    });
    
    if (recentlyCreated) {
      console.log(`Duplicate message detected with tempId: ${_tempId}`);
      return res.status(200).json({
        ...recentlyCreated.toObject(),
        _tempId
      });
    }
    
    const newMessage = new Message({ roomId, senderId, receiverId, content });
    const savedMessage = await newMessage.save();
    
    // Return the message with the tempId included for client-side matching
    res.status(201).json({
      ...savedMessage.toObject(),
      _tempId
    });
  } catch (err) {
    console.error('Failed to save message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET: Get messages by room ID
router.get('/messages/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 });
    
    // Apply strict deduplication by _id
    const seenIds = new Set();
    const uniqueMessages = [];
    
    for (const msg of messages) {
      const msgId = msg._id.toString();
      if (!seenIds.has(msgId)) {
        seenIds.add(msgId);
        uniqueMessages.push(msg);
      }
    }
    
    console.log(`Returning ${uniqueMessages.length} messages for room ${req.params.roomId}`);
    res.status(200).json(uniqueMessages);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;