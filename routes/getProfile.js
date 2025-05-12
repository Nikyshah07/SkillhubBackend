// GET /getProfile
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');

router.get('/getProfile',authentiCate, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId); // Assuming authMiddleware sets req.userId
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json({
        name: user.name,
        city: user.city,
        bio: user.bio,
        gender: user.gender,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  module.exports=router