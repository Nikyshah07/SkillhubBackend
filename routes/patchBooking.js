const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const {Booking} = require("../models/Booking");
const {authentiCate}=require('../middleware')
router.patch("/update-status/:id", authentiCate, async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router