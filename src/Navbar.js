import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {

  const [unread, setUnread] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  /* ===============================
     FETCH UNREAD COUNT
  ================================= */
  useEffect(() => {
    if (!userId) return;

    const fetchUnread = () => {
      fetch(`http://localhost:5000/api/messages/unread/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUnread(data.totalUnread || 0);
        })
        .catch(() => setUnread(0));
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);

  }, [userId]);

  return (
    <div className="navbar">
      <div className="logo">
        🌱 AgriBloom Connect
      </div>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/browse">Browse</Link>

        <Link to="/messages" className="messages-link">
          Messages
          {unread > 0 && (
            <span className="nav-badge">
              {unread}
            </span>
          )}
        </Link>

        <Link to="/profile">Profile</Link>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
