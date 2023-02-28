import React from "react";
import Logo from "../assets/StealthIconTransparent.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, provider } from "../firebase";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";

const Navbar = () => {
  const [LoadingUser, setLoadingUser] = useState(true);
  const Navigate = useNavigate();
  // const FetchUser = async () => {
  //   setLoadingUser(true);
  //   const [user, loading, error] = useAuthState(auth);
  //   setLoadingUser(false);
  // };

  async function FetchUser() {
    // after 2 seconds make it false
    setTimeout(() => {
      setLoadingUser(false);
    }, 1000);
  }

  const [user, loading, error] = useAuthState(auth);

  FetchUser();

  const LogUserOut = () => {
    signOut(auth);
    toast.success("Logged Out Successfully");
    Navigate("/");
  };

  return (
    <nav className="navbar">
      {LoadingUser ? (
        <div className="loading-navbar">
          <SyncLoader color="#fff" size={10} />
        </div>
      ) : (
        <>
          <a href="/" className="logo">
            <img src={Logo} alt="logo" />
          </a>
          <ul className="list-items">
            {!user ? (
              <div className="unauthorized-list">
                <Link to="/login" className="links">
                  <button className="Tilted-button">Sign In</button>
                </Link>
                <Link to="/register" className="links">
                  <button className="Tilted-button invert">Sign Up</button>
                </Link>
              </div>
            ) : (
              <>
                <div className="authorized-list">
                  <Link to="/create" className="links">
                    <button>Create Post</button>
                  </Link>
                  <Link to="/inbox" className="links">
                    <button>Inbox</button>
                  </Link>
                  <Link to={`/user/${user.uid}`} className="links">
                    <button>My Account</button>
                  </Link>
                  <button className="nav-log-out" onClick={LogUserOut}>
                    Log Out
                  </button>
                </div>
              </>
            )}
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;
