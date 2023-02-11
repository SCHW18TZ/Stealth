import React from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  return (
    <div className="LoginPage">
      <div className="LoginForm">
        <form>
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
