const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message"); // ✅ ADDED

/* ===============================
   CREATE OR GET CONVERSATION
================================= */
router.post("/", async (req, res) => {
  try {
    let { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Missing IDs" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId]
    });

    const savedConversation = await newConversation.save();

    res.status(201).json(savedConversation);

  } catch (err) {
    console.error("Create Conversation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET USER CONVERSATIONS
================================= */
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.params.userId
    })
    .populate("members", "firstName")
    .sort({ updatedAt: -1 }); // ✅ ensure proper order

    const formatted = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          conversationId: conv._id
        })
          .sort({ createdAt: -1 })
          .populate("sender", "firstName");

        return {
          ...conv._doc,
          lastMessage
        };
      })
    );

    res.json(formatted);

  } catch (err) {
    console.error("Conversation Fetch Error:", err);
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

module.exports = router;