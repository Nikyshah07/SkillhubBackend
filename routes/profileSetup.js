const express = require("express");
const router = express.Router();
const {User} = require("../models/User");
const {authentiCate}=require('../middleware')

router.put('/profileSetup', authentiCate, async (req, res) => {
  const { name, city, bio, teachSkills, learnSkills,gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.userId, 
      { name, city, bio, teachSkills, learnSkills,gender },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
  
});

module.exports = router;
