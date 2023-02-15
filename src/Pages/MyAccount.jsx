import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  doc,
} from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const MyAccount = () => {
  const [user] = useAuthState(auth);
  const userCollectionRef = collection(db, "users");
  const location = useLocation();
  const { userData } = location.state;
  const [nameavailable, setnameavailable] = useState(null);
  const [editing, setediting] = useState(true);
  const [nameInput, setnameInput] = useState("");
  const [email, setemail] = useState("");
  const [fullname, setfullname] = useState("");
  const [bio, setbio] = useState("");
  const [selectedImage, setselectedImage] = useState(null);

  const enableEdit = () => {
    editing ? setediting(false) : setediting(true);
  };

  console.log(user.displayName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    enableEdit();
    if (selectedImage == null) {
      changeinfo();
    } else {
      const ImageRef = ref(storage, `ProfilePics/${selectedImage.name}`);
      uploadBytes(ImageRef, selectedImage).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateProfile(user, {
            photoURL: url,
          });
          const userDoc = doc(db, "users", userData.id);
          const newFields = { profilePhoto: url };
          updateDoc(userDoc, newFields);
          if (nameInput == "") {
            return null;
          } else {
            updateProfile(user, {
              displayName: nameInput,
            });
            const userDoc = doc(db, "users", userData.id);
            const newFields = { name: nameInput };
            updateDoc(userDoc, newFields);
          }
          if (email == "") {
            return null;
          } else {
            updateProfile(user, {
              email: email,
            });
            const userDoc = doc(db, "users", userData.id);
            const newFields = { email: email };
            updateDoc(userDoc, newFields);
          }
          if (fullname == "") {
            return null;
          } else {
            const userDoc = doc(db, "users", userData.id);
            const newFields = { fullName: fullname };
            updateDoc(userDoc, newFields);
          }
          if (bio == "") {
            return null;
          } else {
            const userDoc = doc(db, "users", userData.id);
            const newFields = { bio: bio };
            updateDoc(userDoc, newFields);
          }
        });
      });
    }
  };

  const changeinfo = async () => {
    if (nameInput == "") {
      console.log("lol");
    } else {
      updateProfile(user, {
        displayName: nameInput,
      });
      const userDoc = doc(db, "users", userData.id);
      const newFields = { name: nameInput };
      await updateDoc(userDoc, newFields);
    }
    if (email == "") {
      console.log("lol");
    } else {
      updateProfile(user, {
        email: email,
      });
      const userDoc = doc(db, "users", userData.id);
      const newFields = { email: email };
      await updateDoc(userDoc, newFields);
    }
    if (fullname == "") {
      console.log("lol");
    } else {
      const userDoc = doc(db, "users", userData.id);
      const newFields = { fullName: fullname };
      await updateDoc(userDoc, newFields);
    }
    if (bio == "") {
      console.log("lol");
    } else {
      const userDoc = doc(db, "users", userData.id);
      const newFields = { bio: bio };
      await updateDoc(userDoc, newFields);
    }
  };

  const usernameQuery = async (e) => {
    const name = e.target.value;
    setnameInput(name);
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

  return (
    <div className="MyAccount">
      <form onSubmit={handleSubmit}>
        <img src={user?.photoURL} alt="" />
        <section className="file-input">
          <Button variant="contained" component="label" className="btn">
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                setselectedImage(e.target.files[0]);
              }}
              disabled={editing ? true : false}
            />
          </Button>
        </section>
        <div className="display-name-container">
          <div className="name-input">
            <input
              type="text"
              onChange={usernameQuery}
              placeholder={user?.displayName}
              disabled={editing ? true : false}
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
        </div>
        <div className="email-container">
          <div className="email-input">
            <input
              type="text"
              placeholder={user?.email}
              onChange={(e) => setemail(e.target.value)}
              disabled={editing ? true : false}
            />
          </div>
          {user.emailVerified ? (
            <p className={`name-available`}>Email Verified</p>
          ) : (
            <p className={`name-already-taken`}>Email Not Verified</p>
          )}
        </div>
        <div className="fullName-input">
          <input
            type="text"
            placeholder={`${
              userData.fullName == ""
                ? "Set Up Your Full Name"
                : userData?.fullName
            }`}
            onChange={(e) => setfullname(e.target.value)}
            disabled={editing ? true : false}
          />
        </div>
        <div className="bio-input">
          <input
            type="text"
            placeholder={`${
              userData.bio == "" ? "Set Up Your bio" : userData?.bio
            }`}
            onChange={(e) => setbio(e.target.value)}
            disabled={editing ? true : false}
          />
        </div>
        <p className="forgot-password">
          Forgot your password? <Link to="/reset">Reset it here</Link>
        </p>
        {!editing && (
          <button type="submit" className="edit-btn">
            Save
          </button>
        )}
      </form>
      {editing && (
        <button type="none" onClick={enableEdit} className="edit-btn">
          Edit
        </button>
      )}
    </div>
  );
};

export default MyAccount;
