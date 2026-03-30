const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");

router.post("/", swapController.createSwap);
router.put("/:swapId", swapController.updateSwapStatus);

module.exports = router;
