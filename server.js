const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes (ONLY ONCE EACH)
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/crops", require("./routes/cropRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/swaps", require("./routes/swapRoutes"));

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/agribloom")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Start server
app.listen(5000, () =>
  console.log("Server running on port 5000")
);
app.use("/api/orders", require("./routes/orderRoutes"));