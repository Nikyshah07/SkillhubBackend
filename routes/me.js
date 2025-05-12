const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');


router.get('/me', authentiCate, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('name email');
      res.json(user);
      console.log(user)
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  

  module.exports=router