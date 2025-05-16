// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require("http");
// const app = express();

// const { User } = require('./models/User');
// const { Message } = require("./models/Message"); 
// const socketIo = require("socket.io");
// const dotenv = require('dotenv');
// app.use(cors());
// app.use(express.json());
// dotenv.config();

// const loginRoute = require('./routes/login');
// const registerRoute = require('./routes/register');
// const forgotPassword = require('./routes/forgotPassword');
// const verifyOtp = require('./routes/verifyOtp');
// const resetPassword = require('./routes/resetPassword');
// const profileSetup = require('./routes/profileSetup');
// const getUsers = require('./routes/getUsers');
// const bookingSystem = require('./routes/bookingSystem');
// const getBooking = require('./routes/getBooking');
// const patchBooking = require('./routes/patchBooking');
// const booking = require('./routes/booking');
// const chatRoutes=require('./routes/chat');
// const fcmToken=require('./routes/fcmToken');
// const sendNotification=require('./routes/sendNotification')
// const getProfile=require('./routes/getProfile')
// const editProfile=require('./routes/editProfile')
// const me=require('./routes/me')
// const deletebooking=require('./routes/deleteBooking')
// const admin = require('firebase-admin'); 

// app.use('/', registerRoute);
// app.use('/', loginRoute);
// app.use('/', forgotPassword);
// app.use('/', verifyOtp);
// app.use('/', resetPassword);
// app.use('/', profileSetup);
// app.use('/', getUsers);
// app.use('/', bookingSystem);
// app.use('/', getBooking);
// app.use('/', patchBooking);
// app.use('/', booking);
// app.use('/',chatRoutes)
// app.use('/',fcmToken)
// app.use('/',sendNotification)
// app.use('/',getProfile)
// app.use('/',editProfile)
// app.use('/',me)
// app.use('/',deletebooking)

// const MONGODB_URI = process.env.URL;

// const response = mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// if (response) {
//   console.log("Connected to MongoDB");
// } else {
//   console.log("Failed to connect to MongoDB");
// }

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: { origin: "*" }
// });




// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
  
//   // Track which rooms this socket has joined
//   const joinedRooms = new Set();
  
//   socket.on("joinRoom", (roomId) => {
//     // Add to our tracking set
//     joinedRooms.add(roomId);
    
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room: ${roomId}`);
//   });
  
//   socket.on("leaveRoom", (roomId) => {
//     // Remove from our tracking set
//     joinedRooms.delete(roomId);
    
//     socket.leave(roomId);
//     console.log(`User ${socket.id} left room: ${roomId}`);
//   });
  
//   socket.on("chatMessage", async ({ roomId, senderId, receiverId, content, _tempId }) => {
//     try {
//       console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);
      
//       // Check for duplicate message within last 5 seconds
//       const recentlyCreated = await Message.findOne({
//         roomId,
//         senderId,
//         content,
//         timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
//       });
      
//       if (recentlyCreated) {
//         console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
//         io.to(roomId).emit("message", {
//           _id: recentlyCreated._id,
//           _tempId,
//           roomId,
//           senderId,
//           receiverId,
//           content,
//           timestamp: recentlyCreated.timestamp
//         });
//         return;
//       }
      
//       // Save the new message to DB
//       const message = new Message({ 
//         roomId, 
//         senderId, 
//         receiverId, 
//         content
//       });
      
//       const savedMessage = await message.save();
//       console.log(`Message saved with ID: ${savedMessage._id}`);
      
//       // Broadcast the message to the room including the tempId
//       io.to(roomId).emit("message", {
//         _id: savedMessage._id,
//         _tempId, // Keep tempId for client matching
//         roomId,
//         senderId,
//         receiverId,
//         content,
//         timestamp: savedMessage.timestamp
//       });
      
//       // === NEW: Send push notification to receiver ===
//       const receiverUser = await User.findById(receiverId);
//       const senderUser = await User.findById(senderId); // 🔍 fetch sender's details
// const senderName = senderUser?.name || `User ${senderId}`; // fallback just in case
// //if (receiverUser && receiverUser.fcmToken) {

//       if (receiverUser && receiverUser.fcmToken && receiverId !== senderId) {
//         const notificationPayload = {
//           notification: {
//             title: `New message from User ${senderName}`, // Optional: Replace with sender name if available
//             body: content,
//           },
//           data: {
//             roomId,
//             senderId,
//             screen: 'chat', // Your app can use this to open chat screen
//           },
//           token: receiverUser.fcmToken,
//         };
      
//         admin.messaging().send(notificationPayload)
//           .then(response => {
//             console.log('Notification sent:', response);
//           })
//           .catch(error => {
//             console.error('Notification error:', error);
//           });
//       }
      
//     } catch (error) {
//       console.error("Error saving message:", error);
//       socket.emit("messageError", { 
//         error: "Failed to save message", 
//         _tempId 
//       });
//     }
//   });
  
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     joinedRooms.clear();
//   });
// });


// // Simple root route
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

// const PORT = process.env.PORT || 5000;
// // Start server
// server.listen(PORT, () => {
//   console.log("Server started on ports 5000");
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");
const app = express();

const { User } = require('./models/User');
const { Message } = require("./models/Message");
const socketIo = require("socket.io");
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());
dotenv.config();

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const forgotPassword = require('./routes/forgotPassword');
const verifyOtp = require('./routes/verifyOtp');
const resetPassword = require('./routes/resetPassword');
const profileSetup = require('./routes/profileSetup');
const getUsers = require('./routes/getUsers');
const bookingSystem = require('./routes/bookingSystem');
const getBooking = require('./routes/getBooking');
const patchBooking = require('./routes/patchBooking');
const booking = require('./routes/booking');
const chatRoutes=require('./routes/chat');
const fcmToken=require('./routes/fcmToken');
const sendNotification=require('./routes/sendNotification')
const getProfile=require('./routes/getProfile')
const editProfile=require('./routes/editProfile')
const me=require('./routes/me')
const deletebooking=require('./routes/deleteBooking')
const admin = require('firebase-admin');

app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/', forgotPassword);
app.use('/', verifyOtp);
app.use('/', resetPassword);
app.use('/', profileSetup);
app.use('/', getUsers);
app.use('/', bookingSystem);
app.use('/', getBooking);
app.use('/', patchBooking);
app.use('/', booking);
app.use('/',chatRoutes)
app.use('/',fcmToken)
app.use('/',sendNotification)
app.use('/',getProfile)
app.use('/',editProfile)
app.use('/',me)
app.use('/',deletebooking)

const MONGODB_URI = process.env.URL;

const response = mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (response) {
  console.log("Connected to MongoDB");
} else {
  console.log("Failed to connect to MongoDB");
}

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// Track all active clients and their rooms
const activeClients = new Map(); // socket.id -> Set of roomIds

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Create a set to track rooms for this socket
//   activeClients.set(socket.id, new Set());

//   socket.on("joinRoom", (roomId) => {
//     // Add to our tracking set
//     activeClients.get(socket.id).add(roomId);

//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room: ${roomId}`);
//   });

//   socket.on("leaveRoom", (roomId) => {
//     // Remove from our tracking set
//     if (activeClients.has(socket.id)) {
//       activeClients.get(socket.id).delete(roomId);
//     }

//     socket.leave(roomId);
//     console.log(`User ${socket.id} left room: ${roomId}`);
//   });

//   socket.on("chatMessage", async ({ roomId, senderId, receiverId, content, _tempId }) => {
//     try {
//       console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);

//       // Check for duplicate message within last 5 seconds
//       const recentlyCreated = await Message.findOne({
//         roomId,
//         senderId,
//         content,
//         timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
//       });
      
//       if (recentlyCreated) {
//         console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
//         io.to(roomId).emit("message", {
//           _id: recentlyCreated._id,
//           _tempId,
//           roomId,
//           senderId,
//           receiverId,
//           content,
//           timestamp: recentlyCreated.timestamp
//         });
//         return;
//       }
      
//       // Save the new message to DB
//       const message = new Message({ 
//         roomId, 
//         senderId, 
//         receiverId, 
//         content
//       });
      
//       const savedMessage = await message.save();
//       console.log(`Message saved with ID: ${savedMessage._id}`);
      
//       // Broadcast the message to the room including the tempId
//       io.to(roomId).emit("message", {
//         _id: savedMessage._id,
//         _tempId, // Keep tempId for client matching
//         roomId,
//         senderId,
//         receiverId,
//         content,
//         timestamp: savedMessage.timestamp
//       });
      
//       // Send push notification to receiver
//       const receiverUser = await User.findById(receiverId);
//       const senderUser = await User.findById(senderId);

//       const senderName = senderUser?.name || `User ${senderId}`;
      
//       if (receiverUser && receiverUser.fcmToken && receiverId !== senderId) {
//         const notificationPayload = {
//           notification: {
//             title: `New message from ${senderName}`,
//             body: content,
//           },
//           data: {
//             roomId,
//             senderId,
//             screen: 'chat',
//           },
//           token: receiverUser.fcmToken,
//         };
      
//         admin.messaging().send(notificationPayload)
//           .then(response => {
//             console.log('Notification sent:', response);
//           })
//           .catch(error => {
//             console.error('Notification error:', error);
//           });
//       }
      
//     } catch (error) {
//       console.error("Error saving message:", error);
//       socket.emit("messageError", { 
//         error: "Failed to save message", 
//         _tempId 
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     // Clean up our tracking data
//     activeClients.delete(socket.id);
//   });
// });

// socket.on("chatMessage", async ({ roomId, senderId, receiverId, content, _tempId }) => {
//   try {
//     console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);

//     // Check for duplicate message within last 5 seconds
//     const recentlyCreated = await Message.findOne({
//       roomId,
//       senderId,
//       content,
//       timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
//     });
    
//     if (recentlyCreated) {
//       console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
//       io.to(roomId).emit("message", {
//         _id: recentlyCreated._id,
//         _tempId,
//         roomId,
//         senderId,
//         receiverId,
//         content,
//         timestamp: recentlyCreated.timestamp
//       });
//       return;
//     }
    
//     // Save the new message to DB
//     const message = new Message({ 
//       roomId, 
//       senderId, 
//       receiverId, 
//       content
//     });
    
//     const savedMessage = await message.save();
//     console.log(`Message saved with ID: ${savedMessage._id}`);
    
//     // Broadcast the message to the room including the tempId
//     io.to(roomId).emit("message", {
//       _id: savedMessage._id,
//       _tempId, // Keep tempId for client matching
//       roomId,
//       senderId,
//       receiverId,
//       content,
//       timestamp: savedMessage.timestamp
//     });
    
//     // Send push notification to receiver
//     const receiverUser = await User.findById(receiverId);
    
//     // Fix: Specifically retrieve just the sender's name
//     let senderName = ""; // Initialize as empty string
//     try {
//       const senderUser = await User.findById(senderId);
      
//       // Debug log to see what's coming from database
//       console.log("Debug - Sender user object:", JSON.stringify(senderUser));
      
//       if (senderUser) {
//         // Just use the name directly - no string manipulation
//         senderName = senderUser.name || "";
//         console.log(`Debug - Using sender name: "${senderName}"`);
//       }
//     } catch (err) {
//       console.error("Error getting sender data:", err);
//     }
    
//     // Only use fallback if we truly couldn't get a name
//     if (!senderName || senderName.trim() === "") {
//       senderName = "Someone"; // Generic fallback
//       console.log("Debug - Using fallback name 'Someone'");
//     }
    
//     if (receiverUser && receiverUser.fcmToken && receiverId !== senderId) {
//       // Explicit check to ensure we're not sending "User" in the notification
//       if (senderName.startsWith("User ")) {
//         console.log("Debug - Name starts with 'User ', removing prefix");
//         senderName = senderName.substring(5).trim();
//       }
      
//       const notificationPayload = {
//         notification: {
//           title: `New message from ${senderName}`,
//           body: content,
//         },
//         data: {
//           roomId,
//           senderId,
//           screen: 'ChatScreen',
//           targetUserId: receiverId,
//         },
//         token: receiverUser.fcmToken,
//       };
      
//       console.log(`Debug - Final notification title: "New message from ${senderName}"`);
    
//       admin.messaging().send(notificationPayload)
//         .then(response => {
//           console.log('Notification sent:', response);
//         })
//         .catch(error => {
//           console.error('Notification error:', error);
//         });
//     }
    
//   } catch (error) {
//     console.error("Error saving message:", error);
//     socket.emit("messageError", { 
//       error: "Failed to save message", 
//       _tempId 
//     });
//   }
// });
// })




io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a set to track rooms for this socket
  activeClients.set(socket.id, new Set());

  socket.on("joinRoom", (roomId) => {
    // Add to our tracking set
    activeClients.get(socket.id).add(roomId);

    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    // Remove from our tracking set
    if (activeClients.has(socket.id)) {
      activeClients.get(socket.id).delete(roomId);
    }

    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  socket.on("chatMessage", async ({ roomId, senderId, receiverId, content, _tempId }) => {
    try {
      console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);

      // Check for duplicate message within last 5 seconds
      const recentlyCreated = await Message.findOne({
        roomId,
        senderId,
        content,
        timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
      });
      
      if (recentlyCreated) {
        console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
        
        // Only emit to the room once
        socket.to(roomId).emit("message", {
          _id: recentlyCreated._id,
          _tempId,
          roomId,
          senderId,
          receiverId,
          content,
          timestamp: recentlyCreated.timestamp
        });
        
        // Also send back to sender to confirm receipt
        socket.emit("message", {
          _id: recentlyCreated._id,
          _tempId,
          roomId,
          senderId,
          receiverId, 
          content,
          timestamp: recentlyCreated.timestamp
        });
        
        return;
      }
      
      // Save the new message to DB
      const message = new Message({ 
        roomId, 
        senderId, 
        receiverId, 
        content
      });
      
      const savedMessage = await message.save();
      console.log(`Message saved with ID: ${savedMessage._id}`);
      
      // Emit only to others in the room (not the sender)
      socket.to(roomId).emit("message", {
        _id: savedMessage._id,
        _tempId, // Keep tempId for client matching
        roomId,
        senderId,
        receiverId,
        content,
        timestamp: savedMessage.timestamp
      });
      
      // Also send back to sender to confirm receipt
      socket.emit("message", {
        _id: savedMessage._id,
        _tempId, // Keep tempId for client matching
        roomId,
        senderId,
        receiverId,
        content,
        timestamp: savedMessage.timestamp
      });
      
      // Send push notification to receiver
      try {
        const receiverUser = await User.findById(receiverId);
        
        // Get sender's name
        let senderName = ""; 
        const senderUser = await User.findById(senderId);
        
        if (senderUser) {
          senderName = senderUser.name || "";
        }
        
        // Only use fallback if we truly couldn't get a name
        if (!senderName || senderName.trim() === "") {
          senderName = "Someone"; 
        }
        
        if (receiverUser && receiverUser.fcmToken && receiverId !== senderId) {
          const notificationPayload = {
            notification: {
              title: `New message from ${senderName}`,
              body: content,
            },
            data: {
              roomId,
              senderId,
              screen: 'ChatScreen',
              targetUserId: receiverId,
            },
            token: receiverUser.fcmToken,
          };
          
          admin.messaging().send(notificationPayload)
            .then(response => {
              console.log('Notification sent:', response);
            })
            .catch(error => {
              console.error('Notification error:', error);
            });
        }
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Continue even if notification fails
      }
      
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { 
        error: "Failed to save message", 
        _tempId 
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Clean up our tracking data
    activeClients.delete(socket.id);
  });
});





// Simple root route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 5000;
// Start server
server.listen(PORT, () => {
  console.log("Server started on port 5000");
});