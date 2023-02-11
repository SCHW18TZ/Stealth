import React, { useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [showpassword, setshowpassword] = useState(true);

  const toggleshowpassword = () => {
    {
      showpassword ? setshowpassword(false) : setshowpassword(true);
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginForm">
        <form>
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
