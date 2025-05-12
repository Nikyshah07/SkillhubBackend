const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: { type: String },
  senderId: { type: String},
  receiverId: { type: String },
  content: { type: String},
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = { Message };
