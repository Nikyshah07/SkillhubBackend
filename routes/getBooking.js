const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const {Booking} = require("../models/Booking");
const {authentiCate}=require('../middleware')
router.get("/user-bookings", authentiCate, async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.user.userId });
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports=router