import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { updateDoc, collection } from "firebase/firestore";

const MyAccount = () => {
  const [user] = useAuthState(auth);
  const userCollectionRef = collection(db, "users");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    try {
      updateProfile(auth.currentUser, {
        displayName: username,
        email: email,
      });
      // updateDoc(userCollectionRef, {
      //   name: username,
      //   email: email,
      // });
    } catch (err) {
      console.log(err);
    }
  };

  console.log(user);

  return (
    <div className="MyAccount">
      <h1>My Account</h1>

      <form onSubmit={handleSubmit}>
        <img src={user?.photoURL} alt="" />
        <h1>{user?.displayName}</h1>
      </form>
    </div>
  );
};

export default MyAccount;
