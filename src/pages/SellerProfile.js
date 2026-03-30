import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(res => res.json())
      .then(data => setSeller(data));

    fetch(`http://localhost:5000/api/crops`)
      .then(res => res.json())
      .then(data => {
        const sellerCrops = data.filter(c => c.sellerId?._id === id);
        setCrops(sellerCrops);
      });
  }, [id]);

  if (!seller) return <p>Loading...</p>;

  return (
    <div>
      <h2>{seller.firstName} {seller.lastName}</h2>
      <p>{seller.email}</p>

      <h3>Listed Crops</h3>
      {crops.map(crop => (
        <div key={crop._id}>
          <p>{crop.cropName} - ₹{crop.price}</p>
        </div>
      ))}
    </div>
  );
}

export default SellerProfile;
