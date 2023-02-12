import React, { useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  const SignUserIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const [showpassword, setshowpassword] = useState(true);

  const toggleshowpassword = () => {
    {
      showpassword ? setshowpassword(false) : setshowpassword(true);
    }
  };

  return (
    <div className="LoginPage">
      <Toaster />
      <div className="LoginForm">
        <form onSubmit={SignUserIn}>
          <div className="email-input">
            <input type="email" placeholder="Email..." />
          </div>
          <div className="password-input">
            <input
              placeholder="password..."
              type={`${!showpassword ? "text" : "password"}`}
            />
            {showpassword ? (
              <FontAwesomeIcon
                icon={faEyeSlash}
                color="white"
                className="icon"
                onClick={toggleshowpassword}
              />
            ) : (
              <FontAwesomeIcon
                icon={faEye}
                color="white"
                className="icon"
                onClick={toggleshowpassword}
              />
            )}
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
      <GoogleLogin />
    </div>
  );
};

export default Login;
