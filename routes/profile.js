const express = require("express");
const router = express.Router();

// TEMP data (later DB lo replace cheyyachu)
let profile = {
  name: "Ramesh",
  role: "Farmer",
  location: "Warangal",
  image: "https://via.placeholder.com/150"
};

let crops = [
  {
    id: 1,
    name: "Tomato",
    price: 20,
    qty: "50 kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
    status: "Available"
  }
];

let ratings = [
  { user: "Buyer1", stars: 4, comment: "Good quality" }
];

// GET PROFILE
router.get("/", (req, res) => {
  res.json({ profile, crops, ratings });
});

// UPDATE PROFILE
router.put("/update", (req, res) => {
  const { name, location } = req.body;
  profile.name = name;
  profile.location = location;
  res.json({ message: "Profile updated", profile });
});

module.exports = router;
