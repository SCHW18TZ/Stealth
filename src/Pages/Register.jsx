import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import GoogleLogin from "../Components/GoogleLogin";
import { useState } from "react";
import { auth, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import "datetime";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";
const Register = () => {
  const userCollectionRef = collection(db, "users");
  let navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const usernameQuery = async (e) => {
    const name = e.target.value;

    let q = query(userCollectionRef, where("name", "==", name));
    let querySnap = await getDocs(q);
    if (querySnap.size > 0) {
      return;
    } else {
      console.log("NASE NAME");
    }
  };

  const RegisterUser = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      let q = query(userCollectionRef, where("name", "==", name));
      let querySnap = await getDocs(q);
      if (querySnap.size > 0) {
        toast.error("Username is already taken!");
      } else {
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

          if (selectedImage == null) return;
          const ImageRef = ref(
            storage,
            `ProfilePics/${selectedImage.name + v4()}`
          );
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
                createdAt: serverTimestamp(),
              });
            });
          });
          navigate("/");
          toast.success("Registed successfully ");
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            toast.error("Email already in use");
          } else if (err.code === "auth/weak-password") {
            toast.error("Password should be atleast 6 characters long!");
          }
        }
      }
    } catch {
      (err) => {
        console.log(err);
      };
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
          <div>
            <input required type="email" placeholder="Email..." />
          </div>
          <div>
            <input required type="password" placeholder="password..." />
          </div>
          <div className="file-input">
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedImage(e.target.files[0]);
              }}
            />
          </div>
          <button type="submit" className="Register-button">
            Register
          </button>
        </form>
        <div className="google-button-wrapper">
          <GoogleLogin />
        </div>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
