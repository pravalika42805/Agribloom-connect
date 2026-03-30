import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const buyerId = storedUser?._id;

  useEffect(() => {
    fetch(`http://localhost:5000/api/crops/${id}`)
      .then(res => res.json())
      .then(data => setCrop(data))
      .catch(err => console.log(err));
  }, [id]);

  if (!crop) return <p style={{ padding: "20px" }}>Loading...</p>;

  const total = quantity * crop.price;

  const handleOrder = async () => {
    const orderData = {
      cropId: crop._id,
      buyerId,
      sellerId: crop.sellerId,
      quantity,
      totalPrice: total
    };

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      alert("Order placed successfully!");
      navigate("/my-orders");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Place Order</h2>

      <h3>{crop.cropName}</h3>
      <p>Price: ₹{crop.price} / kg</p>

      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <h3>Total: ₹{total}</h3>

      <button
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          marginTop: "10px"
        }}
        onClick={handleOrder}
      >
        Confirm Order
      </button>
    </div>
  );
}

export default Order;