import React from "react";
import { auth } from "../firebase";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
const ForgetPassword = () => {
  const ResetPassword = async (e) => {
    const email = e.target[0].value;
    e.preventDefault();
    const res = await sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset link sent to your email");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/user-not-found")
          toast.error("No user found with this email");
        else {
          toast.error(err.message);
        }
      });
  };

  return (
    <div className="reset">
      <form onSubmit={ResetPassword}>
        <Toaster />
        <h1>Reset Password</h1>
        <input type="email" />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgetPassword;
