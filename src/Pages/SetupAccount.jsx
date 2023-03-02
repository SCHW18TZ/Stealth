import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { collection, where, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { v4 } from "uuid";
import { Toaster, toast } from "react-hot-toast";
import { SyncLoader } from "react-spinners";

const SetpuAccount = () => {
  const [Completed, setCompleted] = useState(null);
  let navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [nameInput, setnameInput] = useState("");
  const [nameavailable, setnameavailable] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const nameInputRef = useRef(null);
  const getUserData = async () => {
    const userCollectionRef = collection(db, "users");

    const q = query(userCollectionRef, where("uid", "==", user.uid));
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      if (doc.data().completedSetup !== true) {
        setCompleted(false);
      } else {
        setCompleted(true);
        navigate("/");
      }
    });
  };

  getUserData();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const file = e.target[1].files[0];

    updateProfile(result.user, {
      displayName: name,
    });
  };

  return (
    <div className="SetupPage">
      {user?.completedSetup !== true ? (
        <div className="SetupPage__container">
          <h1>Setup your account</h1>
          <p>
            You need to setup your account before you can use the app. Please
            enter your name and upload a profile picture.
          </p>
          <form onSubmit={handleSubmit}>
            <input required type="text" placeholder="Name" />
            <input required type="file" />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div>Already Setup</div>
      )}
    </div>
  );
};

export default SetpuAccount;
