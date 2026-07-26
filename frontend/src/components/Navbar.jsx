import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">Renton</Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/tools">Tools</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Sign In
        </Link>

        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </header>
  );
}

export default Navbar;