import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">

        <div>
          <h3>AgriBloom Connect</h3>
          <p>Empowering Farmers Through Technology 🌱</p>
        </div>

        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/browse">Browse Crops</Link>
          <Link to="/messages">Messages</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 AgriBloom Connect. All Rights Reserved.
      </div>
    </div>
  );
}

export default Footer;