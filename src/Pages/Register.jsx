import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import GoogleLogin from "../Components/GoogleLogin";
import { useState, useRef } from "react";
import { auth, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import SyncLoader from "react-spinners/SyncLoader";
import { useAuthState } from "react-firebase-hooks/auth";

const Register = () => {
  const userCollectionRef = collection(db, "users");
  const [Loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [nameInput, setnameInput] = useState("");
  const [nameavailable, setnameavailable] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const nameInputRef = useRef(null);
  const [user, loading, error] = useAuthState(auth);

  const usernameQuery = async (e) => {
    const name = e.target.value;
    setnameInput(name);
    console.log(name);
    let q = query(userCollectionRef, where("name", "==", name));
    let querySnap = await getDocs(q);
    if (querySnap.size > 0) {
      setnameavailable(false);
      console.log(nameInput);
    } else {
      setnameavailable(true);
      console.log(nameInput);
    }
    //Check if name contains any special characters
    if (!/^\w+$/i.test(name)) {
      setnameavailable(false);
      console.log(nameavailable);
    }
  };

  const RegisterUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;

    // if (password !== confirmPassword) {
    //   toast.error("Passwords do not match");
    //   setLoading(false);
    //   return;
    // } else {
    //   try {
    //     navigate("/");
    //     toast.success("Registed successfully");
    //     setLoading(false);
    //     const result = await createUserWithEmailAndPassword(
    //       auth,
    //       email,
    //       password
    //     );

    //     const sendEmail = await sendEmailVerification(auth.currentUser);
    //     console.log(sendEmail);

    //           addDoc(userCollectionRef, {
    //             // name: result.user.displayName.split(" ").join("_").trimEnd(),
    //             email: result.user.email,
    //             // profilePhoto: url,
    //             uid: result.user.uid,
    //             createdAt: serverTimestamp(),
    //             verified: false,
    //             roles: ["Member"],
    //             fullName: "",
    //             bio: "",
    //             followers: [],
    //             following: [],
    //             completedSetup: false,
    //           });

    //         }
    //   } catch (err) {
    //     if (err.code === "auth/email-already-in-use") {
    //       toast.error("Email already in use");
    //     } else {
    //       toast.error(err.message);
    //     }
    //     setLoading(false);
    //   }
    // }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    } else {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userCollectionRef = collection(db, "users");
        const docRef = await addDoc(userCollectionRef, {
          email: result.user.email,
          uid: result.user.uid,
          verified: false,
          roles: ["Member"],
          fullName: "",
          bio: "",
          name: "",
          followers: [],
          following: [],
          completedSetup: false,

          createdAt: serverTimestamp(),
        });

        const sendEmail = await sendEmailVerification(auth.currentUser);
        console.log(sendEmail);

        toast.success("Registed successfully");
        setLoading(false);
        navigate("/");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="RegisterPage">
      {user ? (
        <h1>You are already Logged in</h1>
      ) : (
        <>
          <Toaster />
          <div className="RegisterForm">
            <form onSubmit={RegisterUser}>
              {/* <div>
                <input
                  required
                  type="text"
                  placeholder="Username..."
                  onChange={usernameQuery}
                />
              </div> */}
              {/* {!nameavailable ? (
                <p
                  className={`${
                    nameInput == "" ? "hidden" : ""
                  } name-already-taken`}
                >
                  Usernameame is already taken (unlike you lmfao) or is not
                  valid
                </p>
              ) : (
                <p
                  className={`${
                    nameInput == "" ? "hidden" : ""
                  } name-available`}
                >
                  Name Available
                </p>
              )} */}
              <div>
                <input required type="email" placeholder="Email..." />
              </div>
              <div>
                <input required type="password" placeholder="password..." />
              </div>
              <div>
                <input
                  required
                  type="password"
                  placeholder="Confirm password..."
                />
              </div>
              <button
                disabled={nameavailable == false}
                type="submit"
                className="Register-button"
              >
                {Loading ? <SyncLoader /> : <p>Sign Up</p>}
              </button>
            </form>
            <div className="google-button-wrapper">
              <GoogleLogin />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
