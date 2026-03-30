import { useEffect, useState } from "react";
import "./Profile.css";
import EditProfileModal from "./EditProfileModal";

function Profile() {
  const [activeTab, setActiveTab] = useState("crops");
  const [profile, setProfile] = useState(null);
  const [myCrops, setMyCrops] = useState([]);
  const [myOrders, setMyOrders] = useState([]);        // ✅ added
  const [mySales, setMySales] = useState([]);          // ✅ added
  const [showEdit, setShowEdit] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setProfile({
      name: storedUser.firstName + " " + storedUser.lastName,
      role: storedUser.role || "Farmer",
      location: storedUser.address || "Not updated",
      email: storedUser.email
    });
// Fetch ALL crops
fetch(`http://localhost:5000/api/crops`)
  .then(res => res.json())
  .then(data => {
    const filtered = Array.isArray(data)
      ? data.filter(crop =>
          crop.sellerId?._id === userId ||
          crop.sellerId === userId
        )
      : [];

    setMyCrops(filtered);
  });

    // ✅ Fetch My Orders (Buyer Side)
    fetch(`http://localhost:5000/api/orders/buyer/${userId}`)
      .then(res => res.json())
      .then(data => setMyOrders(Array.isArray(data) ? data : []));

    // ✅ Fetch My Sales (Seller Side)
    fetch(`http://localhost:5000/api/orders/seller/${userId}`)
      .then(res => res.json())
      .then(data => setMySales(Array.isArray(data) ? data : []));

  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const deleteCrop = async (cropId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this crop?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/crops/${cropId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setMyCrops(prev => prev.filter(crop => crop._id !== cropId));
      } else {
        alert("Delete failed");
      }

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!profile) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-wrapper">

      {/* PROFILE HEADER */}
      <div className="profile-card">

        <div className="profile-avatar">
          {profile.name.charAt(0)}
        </div>

        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p className="role">🌱 {profile.role}</p>
          <p className="location">📍 {profile.location}</p>
          <p className="email">{profile.email}</p>
        </div>

        <div className="profile-buttons">
          <button className="edit-btn" onClick={() => setShowEdit(true)}>
            Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

      {/* STATS SECTION (unchanged) */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>{myCrops.length}</h3>
          <p>Total Listings</p>
        </div>

        <div className="stat-card">
          <h3>
            {myCrops.reduce((acc, crop) => acc + Number(crop.quantity || 0), 0)}
          </h3>
          <p>Total Stock (kg)</p>
        </div>

        <div className="stat-card">
          <h3>
            ₹{myCrops.reduce((acc, crop) =>
              acc + (Number(crop.price || 0) * Number(crop.quantity || 0)), 0)}
          </h3>
          <p>Estimated Value</p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "crops" ? "active" : ""}
          onClick={() => setActiveTab("crops")}
        >
          My Crops
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>

        <button
          className={activeTab === "sales" ? "active" : ""}
          onClick={() => setActiveTab("sales")}
        >
          Sales
        </button>

        <button
          className={activeTab === "swaps" ? "active" : ""}
          onClick={() => setActiveTab("swaps")}
        >
          Swap History
        </button>
      </div>

      {/* CONTENT */}
      <div className="profile-content">

        {/* CROPS TAB (unchanged) */}
        {activeTab === "crops" && (
          myCrops.length === 0 ? (
            <p className="no-data">No crops listed yet</p>
          ) : (
            <div className="crop-list">
              {myCrops.map(crop => (
                <div className="crop-card" key={crop._id}>
                  {crop.image && (
                    <img
                      src={`http://localhost:5000/uploads/${crop.image}`}
                      alt={crop.cropName}
                    />
                  )}

                  <div className="crop-details">
                    <h4>{crop.cropName}</h4>
                    <p>Category: {crop.category}</p>
                    <p>₹{crop.price} / kg</p>
                    <p>{crop.quantity} kg</p>
                    <p>📍 {crop.location}</p>

                    <button
                      onClick={() => deleteCrop(crop._id)}
                      style={{
                        marginTop: "8px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* MY ORDERS TAB */}
        {activeTab === "orders" && (
          myOrders.length === 0 ? (
            <p className="no-data">No orders placed yet</p>
          ) : (
            myOrders.map(order => (
              <div className="crop-card" key={order._id}>
                <div className="crop-details">
                  <h4>{order.cropId?.cropName}</h4>
                  <p>Quantity: {order.quantity} kg</p>
                  <p>Total: ₹{order.totalPrice}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))
          )
        )}

        {/* SALES TAB */}
        {activeTab === "sales" && (
          mySales.length === 0 ? (
            <p className="no-data">No sales yet</p>
          ) : (
            mySales.map(order => (
              <div className="crop-card" key={order._id}>
                <div className="crop-details">
                  <h4>{order.cropId?.cropName}</h4>
                  <p>Buyer: {order.buyerId?.firstName}</p>
                  <p>Quantity: {order.quantity} kg</p>
                  <p>Total: ₹{order.totalPrice}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))
          )
        )}

        {/* SWAPS TAB (unchanged placeholder) */}
        {activeTab === "swaps" && (
          <div className="swap-history">
            <p>No swap history yet.</p>
          </div>
        )}

      </div>

      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
        />
      )}

    </div>
  );
}

export default Profile;