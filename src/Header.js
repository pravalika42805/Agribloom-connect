import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // 🔹 Hide header on login & register pages
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // 🔹 Logout handler (ONLY ONE)
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (hideHeader) return null;

  return (
    <header className="header">
      <div className="logo">AgriBloom Connect 🌱</div>

      <nav className="nav">
        {isLoggedIn ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/profile">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
