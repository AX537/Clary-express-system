import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ 
      marginTop: "50px", 
      padding: "20px", 
      background: "#333", 
      color: "white",
      textAlign: "center"
    }}>
      <div style={{ marginBottom: "10px" }}>
        <Link to="/about" style={{ color: "white", marginRight: "15px", textDecoration: "none" }}>
          About Us
        </Link>
        <Link to="/help" style={{ color: "white", marginRight: "15px", textDecoration: "none" }}>
          Help
        </Link>
        <Link to="/privacy" style={{ color: "white", textDecoration: "none" }}>
          Privacy Policy
        </Link>
      </div>
      <p style={{ margin: 0, fontSize: "14px" }}>
        &copy; 2026 Clary Express Ticketing System. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;