const express = require("express");
const router = express.Router();
const multer = require("multer");
const Crop = require("../models/Crop");

/* ===============================
   📂 MULTER CONFIGURATION
================================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ===============================
   ✅ CREATE CROP
================================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      sellerId,
      category,
      cropName,
      quantity,
      price,
      location,
      hours
    } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID missing" });
    }

    const newCrop = new Crop({
      sellerId,
      category,
      cropName,
      quantity,
      price,
      location,
      hours,
      image: req.file ? req.file.filename : ""
    });

    await newCrop.save();

    res.status(201).json({
      message: "Crop listed successfully",
      crop: newCrop
    });

  } catch (error) {
    console.log("SELL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ✅ GET ALL CROPS
================================= */
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate("sellerId", "firstName lastName");

    res.json(crops);
  } catch (err) {
    console.error("Fetch crops error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ✅ GET CROPS BY USER
================================= */
router.get("/user/:userId", async (req, res) => {
  try {
    const crops = await Crop.find({
      sellerId: req.params.userId
    }).populate("sellerId", "firstName lastName");

    res.json(crops);
  } catch (err) {
    console.error("User Crops Error:", err);
    res.status(500).json({ message: "Error fetching user crops" });
  }
});

/* ===============================
   ✅ GET SINGLE CROP BY ID
================================= */
router.get("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate("sellerId", "firstName lastName");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(crop);
  } catch (err) {
    console.error("Get Crop Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ✅ UPDATE CROP
================================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ===============================
   ✅ DELETE CROP
================================= */
router.delete("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({ message: "Crop deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;