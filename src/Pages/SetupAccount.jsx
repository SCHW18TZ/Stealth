import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { collection, where, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const SetpuAccount = () => {
  const [Completed, setCompleted] = useState(null);
  const userCollectionRef = collection(db, "users");
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
      console.log(doc.data());

      if (doc.data().completedSetup !== true) {
        setCompleted(false);
      } else {
        setCompleted(true);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

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
    console.log(e.target);
    e.preventDefault();
    const name = e.target[0].value;
    const file = e.target[1].files[0];
    const bio = e.target[2].value;
    const fullName = e.target[3].value;

    try {
      updateProfile(user, {
        displayName: name,
      });

      console.log(e);
      console.log(file, name, bio, fullName);
      if (file == null) return;
      else {
        const ImageRef = ref(storage, `ProfilePics/${file.name + user.uid}`);
        uploadBytes(ImageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            updateProfile(user, {
              photoURL: url,
            });
            const userCollectionRef = collection(db, "users");
            const q = query(userCollectionRef, where("uid", "==", user.uid));
            const querySnap = getDocs(q);
            querySnap.forEach((doc) => {
              console.log(doc.data());
              doc.ref.update({
                completedSetup: true,
                profilePhoto: url,
                name: name,
                fullName: fullName,
                bio: bio,
                completedSetup: true,
              });
            });
          });
        });
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
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
            <input
              require
              type="text"
              placeholder="Username"
              onChange={usernameQuery}
              ref={nameInputRef}
            />
            <input type="file" required />

            {!nameavailable ? (
              <p
                className={`${
                  nameInput == "" ? "hidden" : ""
                } name-already-taken`}
              >
                Usernameame is already taken (unlike you lmfao) or is not valid
              </p>
            ) : (
              <p
                className={`${nameInput == "" ? "hidden" : ""} name-available`}
              >
                Name Available
              </p>
            )}
            <input required type="text" placeholder="Enter Your Fullname" />
            <textarea
              required
              value="chamar"
              name="bio"
              id=""
              cols="30"
              rows="10"
            >
              Enter your bio
            </textarea>
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
