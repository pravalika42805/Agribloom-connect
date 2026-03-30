const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/* ===============================
   SEND MESSAGE
================================= */
router.post("/", async (req, res) => {
  try {
    const { conversationId, senderId, text, type, swapData } = req.body;

    if (!conversationId || !senderId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      text: type === "swap" ? null : text,
      type: type || "text",
      swapData: type === "swap" ? swapData : undefined
    });

    await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });

    res.status(201).json(newMessage);

  } catch (err) {
    console.error("Message Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===============================
   GET UNREAD COUNT
================================= */
router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      members: userId
    });

    const conversationIds = conversations.map(c => c._id);

    if (conversationIds.length === 0) {
      return res.json({ totalUnread: 0, byConversation: {} });
    }

    const unreadMessages = await Message.find({
      conversationId: { $in: conversationIds },
      sender: { $ne: userId },
      isRead: false
    });

    const grouped = {};

    unreadMessages.forEach(msg => {
      const convId = msg.conversationId.toString();
      grouped[convId] = (grouped[convId] || 0) + 1;
    });

    res.json({
      totalUnread: unreadMessages.length,
      byConversation: grouped
    });

  } catch (err) {
    console.error("Unread Error:", err);
    res.status(500).json({ message: "Error fetching unread count" });
  }
});


/* ===============================
   MARK AS READ
================================= */
router.put("/mark-read", async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Error marking messages as read" });
  }
});


/* ===============================
   GET MESSAGES
================================= */
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
      .populate("sender", "firstName")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    console.error("Fetch Messages Error:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


/* ===============================
   UPDATE MESSAGE (SWAP STATUS)
================================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;