const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Crop = require("./models/Crop");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/agri")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Agrii backend is running");
});
app.get("/recent-crops", async (req, res) => {
  try {
    const crops = await Crop.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(crops);
  } catch (error) {
    console.error("Error fetching recent crops:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
