import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import GoogleButton from "react-google-button";
import GoogleLogin from "../Components/GoogleLogin";
import { createUserWithEmailAndPassword } from "firebase/auth";
const Register = () => {
  let navigate = useNavigate();
  const RegisterUser = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const image = e.target[3].files[0];
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("User created successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("That email address is already in use!");
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="RegisterPage">
      <Toaster />
      <div className="RegisterForm">
        <h1>Register</h1>
        <form onSubmit={RegisterUser}>
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
