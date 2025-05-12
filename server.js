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


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  // Track which rooms this socket has joined
  const joinedRooms = new Set();
  
  socket.on("joinRoom", (roomId) => {
    // Add to our tracking set
    joinedRooms.add(roomId);
    
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });
  
  socket.on("leaveRoom", (roomId) => {
    // Remove from our tracking set
    joinedRooms.delete(roomId);
    
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });
  
  socket.on("chatMessage", async ({ roomId, senderId, receiverId, content, _tempId }) => {
    try {
      console.log(`Processing message in room ${roomId} from ${senderId} with tempId: ${_tempId}`);
      
      // Check if a message with the same content was recently sent (within last 5 seconds)
      // This helps prevent duplicate messages when network issues occur
      const recentlyCreated = await Message.findOne({
        roomId,
        senderId,
        content,
        timestamp: { $gt: new Date(Date.now() - 5000) } // 5 seconds
      });
      
      if (recentlyCreated) {
        console.log(`Duplicate message detected, using existing message ID: ${recentlyCreated._id}`);
        // Broadcast the message with the existing ID and the tempId
        io.to(roomId).emit("message", {
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
      
      // Create and save the message to the database
      const message = new Message({ 
        roomId, 
        senderId, 
        receiverId, 
        content
      });
      
      const savedMessage = await message.save();
      console.log(`Message saved with ID: ${savedMessage._id}`);
      
      // Broadcast the message to everyone in the room including the tempId
      io.to(roomId).emit("message", {
        _id: savedMessage._id,
        _tempId, // Include the original tempId for matching
        roomId,
        senderId,
        receiverId,
        content,
        timestamp: savedMessage.timestamp
      });
    } catch (error) {
      console.error("Error saving message:", error);
      // Only send error back to the original sender
      socket.emit("messageError", { 
        error: "Failed to save message", 
        _tempId 
      });
    }
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Clean up joined rooms
    joinedRooms.clear();
  });
});


// Simple root route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 5000;
// Start server
server.listen(PORT, () => {
  console.log("Server started on ports 5000");
});
