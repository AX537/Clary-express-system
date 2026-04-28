import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={{ padding: "10px", background: "#333" }}>
      <nav>
        <Link to="/" style={{ color: "white", marginRight: "15px" }}>
          Home
        </Link>

        <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
          Login
        </Link>

        <Link to="/booking" style={{ color: "white", marginRight: "15px" }}>
          Booking
        </Link>

        {/* ADD THESE TWO LINKS */}
        <Link to="/about" style={{ color: "white", marginRight: "15px" }}>
          About Us
        </Link>

        <Link to="/help" style={{ color: "white", marginRight: "15px" }}>
          Help
        </Link>
      </nav>
    </header>
  );
}

export default Header;