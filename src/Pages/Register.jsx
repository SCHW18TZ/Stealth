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

const Register = () => {
  const userCollectionRef = collection(db, "users");
  let navigate = useNavigate();
  const [nameInput, setnameInput] = useState("");
  const [nameavailable, setnameavailable] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const nameInputRef = useRef(null);

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
  };

  const RegisterUser = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(result.user, {
        displayName: name,
      });

      const emailSen = await sendEmailVerification(auth.currentUser);
      console.log(emailSen);

      if (selectedImage == null) return;
      const ImageRef = ref(storage, `ProfilePics/${selectedImage.name + v4()}`);
      uploadBytes(ImageRef, selectedImage).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateProfile(result.user, {
            photoURL: url,
          });
          addDoc(userCollectionRef, {
            name: result.user.displayName.split(" ").join("_").trimEnd(),
            email: result.user.email,
            profilePhoto: url,
            uid: result.user.uid,
          });
        });
      });
      navigate("/");
      toast.success("Registed successfully");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="RegisterPage">
      <Toaster />
      <div className="RegisterForm">
        <form onSubmit={RegisterUser}>
          <div>
            <input
              required
              type="text"
              placeholder="Username..."
              onChange={usernameQuery}
            />
          </div>
          {!nameavailable ? (
            <p
              className={`${
                nameInput == "" ? "hidden" : ""
              } name-already-taken`}
            >
              Name Already Taken
            </p>
          ) : (
            <p className={`${nameInput == "" ? "hidden" : ""} name-available`}>
              Name Available
            </p>
          )}
          <div>
            <input required type="email" placeholder="Email..." />
          </div>
          <div>
            <input required type="password" placeholder="password..." />
          </div>
          <section className="file-input">
            <Button variant="contained" component="label" className="btn">
              Upload Image
              <input
                hidden
                required
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedImage(e.target.files[0]);
                }}
              />
            </Button>
          </section>
          <button type="submit" className="Register-button">
            Register
          </button>
        </form>
        <div className="google-button-wrapper">
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
