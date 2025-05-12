const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authentiCate } = require('../middleware');

// GET users with optional skill filters
// router.get('/users',authentiCate, async (req, res) => {
//   const { teach, learn } = req.query;
//   const query = {};

//   if (teach) query.teachSkills = { $in: [teach] };
//   if (learn) query.learnSkills = { $in: [learn] };

 

//   try {
//     const users = await User.find(query).select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;


router.get('/users', authentiCate, async (req, res) => {
    const { teach, learn } = req.query;
    const currentUserId = req.user.userId; // 👈 Get logged-in user from token
  
    const orConditions = [];
  
    // if (teach) {
    //   orConditions.push({ teachSkills: { $in: [teach] } });
    // }
  
    // if (learn) {
    //   orConditions.push({ learnSkills: { $in: [learn] } });
    // }
    if (teach) {
        const teachArray = teach.split(",").map(skill => new RegExp(`^${skill.trim()}$`, "i"));
        orConditions.push({ teachSkills: { $in: teachArray } });
      }
      
      if (learn) {
        const learnArray = learn.split(",").map(skill => new RegExp(`^${skill.trim()}$`, "i"));
        orConditions.push({ learnSkills: { $in: learnArray } });
      }
      
    const query = orConditions.length > 0 ? { $or: orConditions } : {};
  
    // 👇 Exclude current user
    query._id = { $ne: currentUserId };
  
    try {
      const users = await User.find(query).select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
module.exports=router  
