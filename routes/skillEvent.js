const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

// Search for users who can teach a given skill
router.get("/match", async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).json({ error: "Skill is required" });
  }

  try {
    const users = await User.find({ teachSkills: { $in: [skill] } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
