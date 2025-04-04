const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const router = express.Router();

// 📌 Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // ✅ Include name in request body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" }); // ✅ Validate name
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword }); // ✅ Save name

    await user.save();
    res
      .status(201)
      .json({ uuid: user.uuid, message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err); // ✅ Log the actual error
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ uuid: user.uuid, message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err); // ✅ Log the actual error
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
