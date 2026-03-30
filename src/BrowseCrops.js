import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseCrops.css";

function BrowseCrops() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("all");
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  /* ------------------ FETCH CROPS ------------------ */
  useEffect(() => {
    fetch("http://localhost:5000/api/crops")
      .then((res) => res.json())
      .then((data) => {
        setCrops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  /* ------------------ AUTO REFRESH ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/api/crops")
        .then(res => res.json())
        .then(data => setCrops(Array.isArray(data) ? data : []));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------ TIME LEFT ------------------ */
  const getRemainingHours = (createdAt, hours) => {
    if (!hours) return 0;
    const expiryTime =
      new Date(createdAt).getTime() + Number(hours) * 60 * 60 * 1000;
    const diff = expiryTime - new Date().getTime();
    if (diff <= 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60));
  };

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ------------------ DELETE ------------------ */
  const deleteCrop = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/crops/${id}`, {
        method: "DELETE",
      });
      setCrops(prev => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ------------------ CHAT ------------------ */
  const startChat = async (sellerId) => {
    if (!sellerId || !userId) {
      alert("Login required to start chat");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          receiverId: sellerId
        }),
      });

      const data = await res.json();
      navigate(`/messages/${data._id}`);

    } catch (err) {
      console.error("Chat start error:", err);
    }
  };

  /* ------------------ SWAP ------------------ */
  const startSwap = (crop) => {
    if (!userId) {
      alert("Login required");
      return;
    }

    if (!crop._id || !crop.sellerId?._id) {
      alert("Invalid crop data");
      return;
    }

    navigate(`/swap/${crop._id}/${crop.sellerId._id}`);
  };

  /* ------------------ ORDER ------------------ */
  const placeOrder = (crop) => {
    if (!userId) {
      alert("Login required to place order");
      return;
    }

    if (crop.sellerId?._id === userId) {
      alert("You cannot order your own crop");
      return;
    }

    navigate(`/order/${crop._id}`);
  };

  /* ------------------ FILTER ------------------ */
  let filtered = crops.filter(
    (crop) =>
      (crop.cropName?.toLowerCase().includes(query.toLowerCase()) ||
        crop.location?.toLowerCase().includes(query.toLowerCase())) &&
      (category === "all" || crop.category === category)
  );

  if (sort === "priceLow")
    filtered.sort((a, b) => Number(a.price) - Number(b.price));

  if (sort === "priceHigh")
    filtered.sort((a, b) => Number(b.price) - Number(a.price));

  if (sort === "time")
    filtered.sort(
      (a, b) =>
        getRemainingHours(a.createdAt, a.hours) -
        getRemainingHours(b.createdAt, b.hours)
    );

  return (
    <div className="browse-wrapper">
      <div className="browse-header">
        <h2>Browse Crops</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search crop or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setQuery(search)}>Search</button>
        </div>
      </div>

      <div className="filter-bar">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="flowers">Flowers</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="time">Time Left</option>
        </select>

        <span className="count">{filtered.length} crops</span>
      </div>

      {loading ? (
        <p className="loading">Loading crops...</p>
      ) : filtered.length === 0 ? (
        <p className="loading">No crops found</p>
      ) : (
        <div className="browse-grid">
          {filtered.map((crop) => (
            <div className="browse-card" key={crop._id}>

              <div className="fav" onClick={() => toggleFavourite(crop._id)}>
                {favourites.includes(crop._id) ? "❤️" : "🤍"}
              </div>

              {crop.image && (
                <img
                  src={`http://localhost:5000/uploads/${crop.image}`}
                  alt={crop.cropName}
                />
              )}

              <h4>{crop.cropName?.toUpperCase()}</h4>

              <p className="rating">
                ⭐ {crop.rating ? crop.rating.toFixed(1) : "New"}
                {crop.reviewsCount ? ` (${crop.reviewsCount})` : ""}
              </p>

              {crop.sellerId && (
                <p
                  className="seller-name"
                  onClick={() => navigate(`/seller/${crop.sellerId._id}`)}
                >
                  👤 {crop.sellerId.firstName} {crop.sellerId.lastName}
                </p>
              )}

              <p className="price">₹{crop.price} / kg</p>
              <p className="small">{crop.quantity} kg available</p>
              <p className="small">{crop.location}</p>

              <p className="time">
                ⏱ {getRemainingHours(crop.createdAt, crop.hours)} hrs left
              </p>

              <div className="card-actions">
                <button
                  className="msg-btn"
                  onClick={() => startChat(crop.sellerId?._id)}
                >
                  💬 Message
                </button>

                <button
                  className="order-btn"
                  onClick={() => placeOrder(crop)}
                >
                  🛒 Order Now
                </button>

                <button
                  className="swap-btn"
                  onClick={() => startSwap(crop)}
                >
                  🔁 Swap
                </button>

                {crop.sellerId?._id === userId && (
                  <>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCrop(crop._id)}
                    >
                      🗑 Delete
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit/${crop._id}`)}
                    >
                      ✏ Edit
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseCrops;