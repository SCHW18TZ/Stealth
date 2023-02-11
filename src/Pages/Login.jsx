import React from "react";
import GoogleLogin from "../Components/GoogleLogin";
const Login = () => {
  return (
    <div className="LoginPage">
      <div className="LoginForm">
        <form>
          <input type="email" placeholder="Email..." />
          <input type="password" placeholder="password..." />
          <button type="submit">Login</button>
        </form>
      </div>
      <GoogleLogin />
    </div>
  );
};

export default Login;
