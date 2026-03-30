import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Swap() {

  // ✅ FIX 1: move useParams inside component
  const { cropId, receiverId } = useParams();

  const [myCrops, setMyCrops] = useState([]);
  const [requestedCrop, setRequestedCrop] = useState(null);

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const requestedCropId = cropId;

  /* ===============================
     FETCH MY CROPS
  ================================= */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/crops/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMyCrops(data);
        else setMyCrops([]);
      })
      .catch(() => setMyCrops([]));
  }, [userId]);

  /* ===============================
     FETCH REQUESTED CROP DETAILS
  ================================= */
  useEffect(() => {
    if (!requestedCropId) return;

    fetch(`http://localhost:5000/api/crops/${requestedCropId}`)
      .then(res => res.json())
      .then(data => setRequestedCrop(data))
      .catch(() => setRequestedCrop(null));
  }, [requestedCropId]);

  /* ===============================
     SEND SWAP PROPOSAL
  ================================= */
const sendSwapRequest = async (offeredCrop) => {
  try {
    // 1️⃣ Create conversation
    const convRes = await fetch("http://localhost:5000/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: userId,
        receiverId: receiverId,
      }),
    });

    const convData = await convRes.json();

    if (!convRes.ok) {
      throw new Error("Conversation creation failed");
    }

    const conversationId = convData._id;

    // 2️⃣ Create swap (PROPER WAY)
    const swapRes = await fetch("http://localhost:5000/api/swaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        proposerId: userId,
        receiverId,
        offeredCropId: offeredCrop._id,
        requestedCropId: requestedCrop._id,

        offeredCropName: offeredCrop.cropName,
        offeredQty: offeredCrop.quantity,
        offeredPrice: offeredCrop.price,

        requestedCropName: requestedCrop.cropName,
        requestedQty: requestedCrop.quantity,
        requestedPrice: requestedCrop.price
      })
    });

    if (!swapRes.ok) {
      throw new Error("Swap failed");
    }

    alert("Professional swap proposal sent ✅");
    navigate(`/messages/${conversationId}`);

  } catch (err) {
    console.error("Swap error:", err);
    alert("Swap failed");
  }
};  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2>Choose a Crop to Offer</h2>

      {requestedCrop && (
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ddd"
          }}
        >
          <h4>Requested Crop</h4>
          <p><strong>{requestedCrop.cropName}</strong></p>
          <p>Price: ₹{requestedCrop.price} / kg</p>
          <p>Available: {requestedCrop.quantity} kg</p>
        </div>
      )}

      {myCrops.length === 0 ? (
        <p>You have no crops available for swap.</p>
      ) : (
        myCrops.map(crop => {
          const offerValue = crop.quantity * crop.price;

          return (
            <div
              key={crop._id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                background: "#ffffff"
              }}
            >
              <h4>{crop.cropName}</h4>
              <p>Price: ₹{crop.price} / kg</p>
              <p>Available: {crop.quantity} kg</p>
              <p>Total Offer Value: ₹{offerValue}</p>

              <button
                onClick={() => sendSwapRequest(crop)}
                style={{
                  marginTop: "10px",
                  background: "#2e7d32",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Send Professional Swap Proposal
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Swap;

