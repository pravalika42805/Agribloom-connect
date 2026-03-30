const express = require("express");
const router = express.Router();
const User = require("c:/Users/lenovo/agrii/backend/models/user");

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});
