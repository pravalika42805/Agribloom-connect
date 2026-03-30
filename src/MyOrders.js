import { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/buyer/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [userId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px"
            }}
          >
            <h3>{order.cropId?.cropName}</h3>
            <p>Quantity: {order.quantity} kg</p>
            <p>Total: ₹{order.totalPrice}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;