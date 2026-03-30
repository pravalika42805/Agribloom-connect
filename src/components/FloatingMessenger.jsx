import { useNavigate } from "react-router-dom";
import "./FloatingMessenger.css";

function FloatingMessenger() {
  const navigate = useNavigate();

  return (
    <div
      className="floating-messenger"
      onClick={() => navigate("/messages")}
      title="Open Messages"
    >
      💬
    </div>
  );
}

export default FloatingMessenger;
