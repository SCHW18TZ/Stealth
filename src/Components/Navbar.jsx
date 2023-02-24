import React from "react";
import Logo from "../assets/StealthIconTransparent.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, provider } from "../firebase";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const Navigate = useNavigate();
  const [user] = useAuthState(auth);
  const LogUserOut = () => {
    signOut(auth);
    toast.success("Logged Out Successfully");
    Navigate("/");
  };
  
  return (
    <nav className="bg-black text-blue-50 flex items-center px-20 border-b-2 border-gray-900">
      <a href="/" className="logo">
        <img src={Logo} alt="logo" />
      </a>
      <ul className="list-items ml-auto">
        {!user ? (
          <div>
            <Link to="/login" className="">
              <button className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">Sign In</button>
            </Link>
            <Link to="/register" className="">
              <button className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">Sign Up</button>
            </Link>
          </div>
        ) : (
          <div className="">
            <Link to="/create">
              <button className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">Create Post</button>
            </Link>
            <Link to="/inbox" className="links bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">
              <button className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">Inbox</button>
            </Link>
            <Link to={`/user/${user.uid}`} className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">
              <button className="bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest">My Account</button>
            </Link>
            <button className="nav-log-out bg-[#2b825b] mx-2 px-3 py-2 rounded-md tracking-widest" onClick={LogUserOut}>
              Log Out
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
