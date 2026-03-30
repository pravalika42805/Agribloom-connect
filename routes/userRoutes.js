const express = require("express");
const router = express.Router();
const User = require("../models/user"); // small u

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      address,
      email,
      contactNumber,
      password
    } = req.body;

    if (
      !username ||
      !firstName ||
      !lastName ||
      !address ||
      !email ||
      !contactNumber ||
      !password
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      address,
      email,
      contactNumber,
      password
    });

    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (username based)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
