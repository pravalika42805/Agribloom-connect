import { useState } from "react";
import "./SellCrop.css";

function SellCrop() {
  const [category, setCategory] = useState("");
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  const BASE_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 ADDED: Get logged-in user safely
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      setMsg("Please login first");
      return;
    }

    if (!category || !cropName || !quantity || !price || !location || !hours) {
      setMsg("Please fill all fields");
      return;
    }

    const formData = new FormData();

    // 🔥 ADDED: sellerId connection
    formData.append("sellerId", user._id);

    formData.append("category", category);
    formData.append("cropName", cropName);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("hours", hours);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/crops`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Crop listed successfully");

        setCategory("");
        setCropName("");
        setQuantity("");
        setPrice("");
        setLocation("");
        setHours("");
        setImage(null);
      } else {
        setMsg(data.message || "Failed to list crop");
      }

    } catch (error) {
      console.error("Error:", error);
      setMsg("Server error");
    }
  };

  return (
    <div className="sell-wrapper">

      <h2 className="sell-title">Sell Your Crop 🌾</h2>

      <form className="sell-form" onSubmit={handleSubmit}>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="flowers">Flowers</option>
        </select>

        <input
          type="text"
          placeholder="Crop Name"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity (kg)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price per kg (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Expiry Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" className="sell-btn">
          List Crop
        </button>

        {msg && <p className="sell-message">{msg}</p>}

      </form>
    </div>
  );
}

export default SellCrop;
