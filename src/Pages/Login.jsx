import React, { useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
      toast.error("Invalid email or password");
    }
  };

  const [showpassword, setshowpassword] = useState(true);

  const toggleshowpassword = () => {
    {
      showpassword ? setshowpassword(false) : setshowpassword(true);
    }
  };

  return (
    <>
      <Toaster />
      <div class="login-page-container">
        <form class="login-card" onSubmit={SignUserIn}>
          <h1 class="login-heading">Welcome Back!</h1>
          <div class="login-input">
            <input type="email" placeholder="Enter your email..." />
            <div class="underline" />
          </div>
          <div class="login-input">
            <input placeholder="Enter your Password..." type="password" />
            <div class="underline" />
          </div>
          <div class="login-button-container">
            <button type="submit" class="login-button">
              Login
            </button>
          </div>
        </form>
        <div className="GoogleLogin">
          <p>Or you can login using Google</p>
          <GoogleLogin />
        </div>
      </div>
    </>
  );
};

export default Login;
