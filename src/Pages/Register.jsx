import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import GoogleButton from "react-google-button";
import GoogleLogin from "../Components/GoogleLogin";

const Register = () => {
  return (
    <div className="RegisterPage">
      <Toaster />
      <div className="RegisterForm">
        <h1>Register</h1>
        <form>
          <input type="text" placeholder="Username..." />
          <input type="email" placeholder="Email..." />
          <input type="password" placeholder="password..." />
          <input type="file" accept="image/*" placeholder="Username..." />
          <button type="submit">Register</button>
        </form>
        <p>Or you can sign in with Google</p>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
