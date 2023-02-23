import React from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { db, auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { addDoc, query, where, getDocs, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
const GoogleLogin = () => {
  let navigate = useNavigate();
  const userCollectionRef = collection(db, "users");

  const LoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate(`/`);
    let q = query(userCollectionRef, where("uid", "==", result.user.uid));
    let querySnap = await getDocs(q);
    if (querySnap.size > 0) {
      return;
    } else {
      addDoc(userCollectionRef, {
        name: result.user.displayName.split(" ").join("_").trimEnd(),
        email: result.user.email,
        profilePhoto: result.user.photoURL,
        uid: result.user.uid,
        createdAt: serverTimestamp(),
        verified: false,
        roles: "Member",
        fullName: "",
        bio: "",
        followers: [],
        following: [],
      });
    }
  };

  return <GoogleButton onClick={LoginWithGoogle} className="google-button" />;
};

export default GoogleLogin;
