import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
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

  return (
    <div className="SetupPage">
      {user?.completedSetup !== true ? (
        <div className="SetupPage__container">
          <h1>Setup your account</h1>
          <p>
            You need to setup your account before you can use the app. Please
            enter your name and upload a profile picture.
          </p>
          <form>
            <input type="text" placeholder="Name" />
            <input type="file" />
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
