import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellCrop.css";

function SellCrop() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")||"null");
  const sellerId = storedUser?._id;

  const [category, setCategory] = useState("");
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
console.log("Seller ID:", sellerId);

  if (!sellerId) {
    setMsg("❌ Please login first");
    return;
  }

  if (!category || !cropName || !quantity || !price || !location || !hours || !image) {
    setMsg("❌ Please fill all fields");
    return;
  }

  try {
    const formData = new FormData();

    // ✅ Always send sellerId properly
    formData.append("sellerId", String(sellerId));

    formData.append("category", category);
    formData.append("cropName", cropName);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("hours", hours);

    // ✅ Only append image if exists
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("http://localhost:5000/api/crops", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      setMsg("✅ Crop listed successfully");

      setCategory("");
      setCropName("");
      setQuantity("");
      setPrice("");
      setLocation("");
      setHours("");
      setImage(null);

      setTimeout(() => {
        navigate("/browse");
      }, 1000);
    } else {
      setMsg("❌ " + (data.message || "Failed to list crop"));
    }
  } catch (error) {
    console.error("SELL ERROR:", error);
    setMsg("❌ Server error");
  }
};

  return (
    <div className="sell-container">
      <h2>Sell Your Crop 🌾</h2>

      <form onSubmit={handleSubmit} className="sell-form">

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
          placeholder="Expiry Time (Hours)"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">List Crop</button>
      </form>

      {msg && <p className="message">{msg}</p>}
    </div>
  );
}

export default SellCrop;
