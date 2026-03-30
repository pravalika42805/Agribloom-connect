const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  category: {
    type: String,
    enum: ["fruits", "vegetables", "flowers"],
    required: true
  },

  cropName: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  hours: {
    type: Number,
    required: true
  },

  image: {
    type: String
  },

  rating: {
    type: Number,
    default: 0
  },

  reviewsCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Crop", cropSchema);