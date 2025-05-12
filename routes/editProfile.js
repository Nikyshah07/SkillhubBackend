// PUT /profileSetup
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');
router.put('/profileSetup', authentiCate, async (req, res) => {
    try {
      const { name, city, bio, gender, teachSkills, learnSkills } = req.body;
  
      if (!name || !city || !gender || !teachSkills || !learnSkills) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const updatedProfile = {
        name,
        city,
        bio: bio || '',
        gender,
        teachSkills: teachSkills.map(skill => skill.trim()),
        learnSkills: learnSkills.map(skill => skill.trim())
      };
  
      const user = await User.findByIdAndUpdate(
        req.userId, // Comes from authMiddleware
        updatedProfile,
        { new: true }
      );
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while updating profile' });
    }
  });
  module.exports=router