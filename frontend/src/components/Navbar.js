import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Function to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ padding: "10px", background: "#333", display: "flex", gap: "15px" }}>
      <Link 
        to="/" 
        style={{ 
          color: "white", 
          textDecoration: "none",
          fontWeight: isActive("/") ? "bold" : "normal",
          borderBottom: isActive("/") ? "2px solid white" : "none"
        }}
      >
        Home
      </Link>

      <Link 
        to="/login" 
        style={{ 
          color: "white", 
          textDecoration: "none",
          fontWeight: isActive("/login") ? "bold" : "normal",
          borderBottom: isActive("/login") ? "2px solid white" : "none"
        }}
      >
        Login
      </Link>

      <Link 
        to="/booking" 
        style={{ 
          color: "white", 
          textDecoration: "none",
          fontWeight: isActive("/booking") ? "bold" : "normal",
          borderBottom: isActive("/booking") ? "2px solid white" : "none"
        }}
      >
        Booking
      </Link>

      <Link 
        to="/about" 
        style={{ 
          color: "white", 
          textDecoration: "none",
          fontWeight: isActive("/about") ? "bold" : "normal",
          borderBottom: isActive("/about") ? "2px solid white" : "none"
        }}
      >
        About Us
      </Link>

      <Link 
        to="/help" 
        style={{ 
          color: "white", 
          textDecoration: "none",
          fontWeight: isActive("/help") ? "bold" : "normal",
          borderBottom: isActive("/help") ? "2px solid white" : "none"
        }}
      >
        Help
      </Link>
    </nav>
  );
}

export default Navbar;