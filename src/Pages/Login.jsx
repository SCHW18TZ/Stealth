import React, { useState } from "react";
import GoogleLogin from "../components/GoogleLogin";
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
    <div className="flex flex-col w-[600px] mx-auto px-12 pt-5 text-[#ededed] bg-[#1c1c1c]">
      <div>
      <h4 className="font-normal text-[#ededed] text-2xl mb-4">
        Welcome Back
      </h4>
      <p className="text-[#bbb] text-sm mb-9">
        Sign in to your account
      </p>
      <Toaster />
      <form onSubmit={SignUserIn} className="flex flex-col justify-center gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg font-medium block mb-2">Email</label>
          <input type="email" id="email"
            placeholder="you@example.com"
            className="block   rounded-md shadow-sm focus:shadow-md outline-none 
             placeholder:text-[#bbb] text-[#bbb]
             placeholder:bg-[#1f1315] border-gray-800 pl-6 py-4 placeholder:text-lg text-lg
             bg-[#1f1315]
             "
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <label htmlFor="" className="text-lg font-medium">Password</label>
            <p className="text-center"><Link to="/reset">  Forgot password? </Link>
            </p>
          </div>
          <input
            placeholder="password..."
            type={`${!showpassword ? "text" : "password"}`}
            className="
                block   rounded-md shadow-sm focus:shadow-md outline-none
               placeholder:text-[#bbb] text-[#bbb]
               placeholder:bg-[#1f1315] border-gray-800 pl-6 py-4 placeholder:text-lg text-lg
               bg-[#1f1315]
                "
          />

          {showpassword ? (
            <FontAwesomeIcon
              icon={faEyeSlash}
              color="white"
              className="icon text-blue-800 mb-3"
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
        <button type="submit"
          className="px-5 py-2 mx-auto bg-black/25 hover:bg-black/60 text-white font-bold">
          Login
        </button>
      </form>

      <div className="text-center my-5">OR</div>
      <div className="flex justify-center">
        <GoogleLogin />
      </div>

      <p>
        Dont have an account? <Link to="/register">Register here</Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
