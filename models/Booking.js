const mongoose = require("mongoose");
const {User}=require('../models/User')
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionTopic: { type: String, required: true },
    sessionDate: { type: String, required: true },
    sessionTime: { type: String, required: true },
    status: { type: String, enum:  ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports={Booking}


// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     sessionTopic: { type: String, required: true },
//     sessionDate: { type: String, required: true },
//     sessionTime: { type: String, required: true },
//     status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
//   },
//   { timestamps: true }
// );

// const Booking = mongoose.model("Booking", bookingSchema);
// module.exports = { Booking };  // Keep your current export style