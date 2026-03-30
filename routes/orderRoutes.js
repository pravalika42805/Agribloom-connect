const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

/* CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET BUYER ORDERS */
router.get("/buyer/:id", async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.id })
      .populate("cropId")
      .populate("sellerId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET SELLER ORDERS */
router.get("/seller/:id", async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.id })
      .populate("cropId")
      .populate("buyerId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;