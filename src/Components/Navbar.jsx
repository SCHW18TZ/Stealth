import React from "react";
import Logo from "../assets/StealthIconTransparent.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, provider } from "../../firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src={Logo} alt="logo" />
      </a>
      <ul className="list-items">
        {!user ? (
          <div className="unauthorized-list">
            <Link to="/login" className="links">
              <button className="Sign-in-button">Sign In</button>
            </Link>
            <Link to="/register" className="links">
              <button className="Sign-up-button">Sign Up</button>
            </Link>
          </div>
        ) : (
          <div className="authorized-list">
            <Link to="/" className="links">
              <button>Home</button>
            </Link>
            <Link to="/inbox" className="links">
              <button>Inbox</button>
            </Link>
            <Link to="/myaccount" className="links">
              <button>My Account</button>
            </Link>
            <button className="nav-log-out">Log Out</button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
