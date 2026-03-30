const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "swap"],
      default: "text",
    },

    text: {
      type: String,
      default: null,
    },

    // 🔥 NEW FIELD
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      default: null,
    },

    // 🟡 Keep temporarily (we remove later)
    swapData: {
      offeredCropName: String,
      offeredQty: Number,
      offeredPrice: Number,

      requestedCropName: String,
      requestedQty: Number,
      requestedPrice: Number,

      status: {
        type: String,
        default: "pending",
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
