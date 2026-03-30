const Swap = require("../models/Swap");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/* ===============================
   CREATE SWAP
================================= */
exports.createSwap = async (req, res) => {
  try {
    const {
      conversationId,
      proposerId,
      receiverId,
      offeredCropId,
      requestedCropId,
      offeredCropName,
      offeredQty,
      offeredPrice,
      requestedCropName,
      requestedQty,
      requestedPrice
    } = req.body;

    if (!conversationId || !proposerId || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Create Swap document
    const swap = await Swap.create({
      conversationId,
      proposerId,
      receiverId,
      offeredCropId,
      requestedCropId,
      status: "PENDING"
    });

    // 2️⃣ Create chat message
    await Message.create({
      conversationId,
      sender: proposerId,
      type: "swap",
      swapId: swap._id,
      swapData: {
        offeredCropName,
        offeredQty,
        offeredPrice,
        requestedCropName,
        requestedQty,
        requestedPrice,
        status: "pending"
      }
    });

    // update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });

    res.status(201).json(swap);

  } catch (err) {
    console.error("Create Swap Error:", err);
    res.status(500).json({ message: "Swap creation failed" });
  }
};


/* ===============================
   UPDATE SWAP STATUS
================================= */
exports.updateSwapStatus = async (req, res) => {
  try {
    const { swapId } = req.params;
    const { status } = req.body;

    const swap = await Swap.findByIdAndUpdate(
      swapId,
      { status },
      { new: true }
    );

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Also update message swapData status
    await Message.updateMany(
      { swapId: swapId },
      { "swapData.status": status.toLowerCase() }
    );

    res.json(swap);

  } catch (err) {
    res.status(500).json({ message: "Swap update failed" });
  }
};