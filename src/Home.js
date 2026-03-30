import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import FloatingMessenger from "./components/FloatingMessenger";



function Home() {
  const navigate = useNavigate();

  const [recentCrops, setRecentCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRecent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crops");
      const data = await res.json();

      if (res.ok) {
        setRecentCrops(data);
      }
    } catch (err) {
      console.error("Error fetching crops:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRecent();
}, []);

  // ⏱ helper to calculate remaining time
  const getRemainingTime = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hrs left`;
  };

  return (
    <div className="home-wrapper">

      {/* ACTION SECTION */}
      <h2 className="home-heading">
        What would you like to do today? 🌱
      </h2>

      <div className="action-circles">
        <div className="action-circle sell" onClick={() => navigate("/sell")}>
          🌾
          <p>Sell Crop</p>
          <span>Add your crop</span>
        </div>

        <div className="action-circle browse" onClick={() => navigate("/browse")}>
          🛒
          <p>Browse Crops</p>
          <span>See market crops</span>
        </div>
      </div>

      {/* RECENT CROPS */}
      <div className="section">
        <h3>Recent Crops</h3>

        {loading ? (
          <p>Loading crops...</p>
        ) : recentCrops.length === 0 ? (
          <p>No crops added yet</p>
        ) : (
          <div className="cards">
            {recentCrops.map((crop) => (
              <div key={crop._id} className="card">

                {crop.image && (
                  <img
                    src={`http://localhost:5000/uploads/${crop.image}`}
                    alt={crop.cropName}
                    className="crop-img"
                  />
                )}

                <p><strong>{crop.cropName}</strong></p>
                <p>₹{crop.price} / kg</p>
                <p>{crop.quantity}</p>
                <p>{crop.location}</p>

                <p className="time-info">
                  {getRemainingTime(crop.expiryTime)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
{/* SWAP FLOATING BUTTON */}
<div
  className="swap-float-btn"
  onClick={() => navigate("/browse?mode=swap")}
>
  🔁 Swap
</div>

      {/* NEARBY FARMERS */}
      <div className="section">
        <h3>Nearby Farmers Crops</h3>
        <div className="cards">
          <div className="card">🌾 Farmer – Warangal</div>
          <div className="card">🌽 Farmer – Nalgonda</div>
          <div className="card">🍚 Farmer – Karimnagar</div>
        </div>
      </div>
  <FloatingMessenger />

    </div>
  );
}

export default Home;
