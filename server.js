



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

// // Track all active clients and their rooms
// const activeClients = new Map(); // socket.id -> Set of roomIds



// // Server-side socket.io event handler fixes

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Create a set to track rooms for this socket
//   activeClients.set(socket.id, new Set());

//   // Add rate limiting for join/leave room operations
//   const joinRoomThrottle = new Map();
  
//   socket.on("joinRoom", (roomId) => {
//     // Implement simple throttling for join room operations
//     const now = Date.now();
//     const lastJoin = joinRoomThrottle.get(`${socket.id}:${roomId}`) || 0;
    
//     if (now - lastJoin < 1000) { // 1 second throttle
//       console.log(`Throttled join request for ${socket.id} in room ${roomId}`);
//       return;
//     }
    
//     joinRoomThrottle.set(`${socket.id}:${roomId}`, now);
    
//     // Check if already in room to prevent duplicate joins
//     if (activeClients.get(socket.id)?.has(roomId)) {
//       console.log(`User ${socket.id} already in room: ${roomId}, ignoring duplicate join`);
//       return;
//     }
    
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

//       // Generate a stable deduplication key based on message content and sender
//       const dedupKey = `${roomId}:${senderId}:${content.substring(0, 20)}`;
      
//       // Use distributed locking with Redis to prevent concurrent processing of the same message
//       const lock = await redisClient.set(`msg_lock:${dedupKey}`, '1', 'NX', 'EX', 5);
      
//       if (!lock) {
//         console.log(`Duplicate message processing detected for ${dedupKey}, skipping`);
//         return;
//       }
      
//       // Check for duplicate message within last 10 seconds
//       const recentlyCreated = await Message.findOne({
//         roomId,
//         senderId,
//         content,
//         timestamp: { $gt: new Date(Date.now() - 10000) } // 10 seconds
//       });
      
//       if (recentlyCreated) {
//         console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
        
//         // Only emit to the room once
//         socket.to(roomId).emit("message", {
//           _id: recentlyCreated._id,
//           _tempId,
//           roomId,
//           senderId,
//           receiverId,
//           content,
//           timestamp: recentlyCreated.timestamp
//         });
        
//         // Also send back to sender to confirm receipt
//         socket.emit("message", {
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
      
//       // Emit only to others in the room (not the sender)
//       socket.to(roomId).emit("message", {
//         _id: savedMessage._id,
//         _tempId, // Keep tempId for client matching
//         roomId,
//         senderId,
//         receiverId,
//         content,
//         timestamp: savedMessage.timestamp
//       });
      
//       // Also send back to sender to confirm receipt
//       socket.emit("message", {
//         _id: savedMessage._id,
//         _tempId, // Keep tempId for client matching
//         roomId,
//         senderId,
//         receiverId,
//         content,
//         timestamp: savedMessage.timestamp
//       });
      
//       // Handle notifications as before...
      
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



// // Simple root route
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

// const PORT = process.env.PORT || 5000;
// // Start server
// server.listen(PORT, () => {
//   console.log("Server started on port 5000");
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



// Server-side socket.io event handler fixes

// Enhanced socket.io server-side communication
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a set to track rooms for this socket
  activeClients.set(socket.id, new Set());

  // Add rate limiting for join/leave room operations
  const joinRoomThrottle = new Map();
  
  // Simple in-memory deduplication cache (alternative to Redis)
  const recentMessageKeys = new Set();
  
  // Cleanup for message deduplication cache every 30 seconds
  const cleanupInterval = setInterval(() => {
    if (recentMessageKeys.size > 1000) {
      console.log("Cleaning up message deduplication cache");
      recentMessageKeys.clear();
    }
  }, 30000);

  // Make sure to clear the interval when the socket disconnects
  socket.on("disconnect", () => {
    clearInterval(cleanupInterval);
  });
  
  socket.on("joinRoom", (roomId) => {
    // Implement simple throttling for join room operations
    const now = Date.now();
    const lastJoin = joinRoomThrottle.get(`${socket.id}:${roomId}`) || 0;
    
    if (now - lastJoin < 1000) { // 1 second throttle
      console.log(`Throttled join request for ${socket.id} in room ${roomId}`);
      return;
    }
    
    joinRoomThrottle.set(`${socket.id}:${roomId}`, now);
    
    if (!roomId) {
      console.error(`User ${socket.id} attempted to join invalid room`);
      return;
    }
    
    // Check if already in room to prevent duplicate joins
    if (activeClients.get(socket.id)?.has(roomId)) {
      console.log(`User ${socket.id} already in room: ${roomId}, ignoring duplicate join`);
      return;
    }
    
    // Add to our tracking set
    activeClients.get(socket.id).add(roomId);

    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Report current users in room for debugging
    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    console.log(`Room ${roomId} has ${clientsInRoom ? clientsInRoom.size : 0} connected clients`);
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
      if (!roomId) {
        console.error(`Invalid roomId in message from ${senderId}`);
        socket.emit("messageError", { 
          error: "Invalid room ID", 
          _tempId 
        });
        return;
      }
      
      console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);

      // Generate a deduplication key based on message content and sender
      const dedupKey = `${roomId}:${senderId}:${content.substring(0, 20)}:${Date.now()}`;
      
      // Simple memory-based deduplication (without Redis)
      if (recentMessageKeys.has(dedupKey)) {
        console.log(`Duplicate message processing detected for ${dedupKey}, skipping`);
        return;
      }
      
      // Add to our in-memory deduplication cache
      recentMessageKeys.add(dedupKey);
      
      // Automatically remove from deduplication cache after 10 seconds
      setTimeout(() => {
        recentMessageKeys.delete(dedupKey);
      }, 10000);
      
      // Check for duplicate message within last 5 seconds in database
      const recentlyCreated = await Message.findOne({
        roomId,
        senderId,
        content,
        timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
      });
      
      if (recentlyCreated) {
        console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
        
        // For reliability, emit to the ENTIRE room, including sender
        io.in(roomId).emit("message", {
          _id: recentlyCreated._id,
          _tempId, // Keep tempId for client matching
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
      
      // Report how many clients are in the target room
      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      console.log(`Broadcasting to ${roomSize} clients in room ${roomId}`);
      
      // IMPORTANT: Use io.in(roomId).emit instead of socket.to(roomId).emit
      // This broadcasts to ALL clients in the room including the sender
      io.in(roomId).emit("message", {
        _id: savedMessage._id,
        _tempId, // Keep tempId for client matching
        roomId,
        senderId,
        receiverId,
        content,
        timestamp: savedMessage.timestamp
      });
      
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