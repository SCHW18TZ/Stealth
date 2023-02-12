import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import GoogleButton from "react-google-button";
import { db, auth, provider } from "../firebase";
import GoogleLogin from "../Components/GoogleLogin";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
const Register = () => {
  let navigate = useNavigate();
  const RegisterUser = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const image = e.target[3].files[0];
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(result.user, {
        displayName: username,
      });
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
          <input required type="text" placeholder="Username..." />
          <input required type="email" placeholder="Email..." />
          <input required type="password" placeholder="password..." />
          <input
            required
            type="file"
            accept="image/*"
            placeholder="Username..."
          />
          <button type="submit">Register</button>
        </form>
        <p>Or you can sign in with Google</p>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
