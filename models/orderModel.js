const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);