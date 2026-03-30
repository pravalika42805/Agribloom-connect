const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    proposerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offeredCropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    requestedCropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", swapSchema);
