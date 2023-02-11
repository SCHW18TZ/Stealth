import React from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  SignUserIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginForm">
        <form onSubmit={SignUserIn}>
          <div className="email-input">
            <input type="email" placeholder="Email..." />
          </div>
          <div className="password-input">
            <input type="password" placeholder="password..." />
            <FontAwesomeIcon
              icon={faEyeSlash}
              color="white"
              className="icons"
            />
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
      <GoogleLogin />
    </div>
  );
};

export default Login;
