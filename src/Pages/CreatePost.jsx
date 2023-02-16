import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { db } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { storage } from "../firebase";
import { useState } from "react";
const CreatePost = () => {
  const postCollectionRef = collection(db, "posts");
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkbox, setcheckbox] = useState([""]);

  const [user] = useAuthState(auth);
  let navigate = useNavigate();

  const changeCheckBox = (e) => {
    return;
  };

  const createPost = async (e) => {
    e.preventDefault();

    // Add selected categories to setCheckbox
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    let categories = [];
    checkboxes.forEach((checkbox) => {
      categories.push(checkbox.value);
    });
    console.log(categories);

    const title = e.target[0].value;
    const description = e.target[1].value;
    if (selectedImage == null) {
      addDoc(postCollectionRef, {
        title: title,
        likes: [],

        description: description,
        image: null,
        author: {
          name: user.displayName,
          uid: user.uid,
        },
        categories: categories,
      });

      navigate("/");
      toast.success("Post created successfully  ");
    } else {
      const ImageRef = ref(storage, `PostPics/${selectedImage.name + v4()}`);
      uploadBytes(ImageRef, selectedImage).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);

          addDoc(postCollectionRef, {
            title: title,
            description: description,
            categories: categories,
            likes: [],
            image: url,
            author: {
              name: user.displayName,
              uid: user.uid,
            },
          });
        });
      });

      navigate("/");
      toast.success("Post created successfully  ");
    }
  };

  console.log(checkbox);
  const sendVerification = async () => {
    const result = await sendEmailVerification(user);
    console.log(result);
  };
  return (
    <div className="CreatePost">
      <Toaster />
      {user ? (
        user.emailVerified ? (
          <div className="LoginPage">
            <Toaster />
            <div className="LoginForm">
              <form onSubmit={createPost}>
                <div className="email-input">
                  <input required type="text" placeholder="name..." />
                </div>
                <div className="password-input">
                  <input required placeholder="Description..." type="text" />
                </div>
                <button type="submit" className="login-btn">
                  Create Post
                </button>
                {/* Checkboxes for categories */}
                <div className="checkboxes">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="coding"
                      value={"coding"}
                      onChange={changeCheckBox}
                    />
                    <label htmlFor="coding">Coding</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="gaming"
                      value={"gaming"}
                      onChange={changeCheckBox}
                    />
                    <label htmlFor="gaming">Gaming</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="meme"
                      onChange={changeCheckBox}
                      value={"meme"}
                    />
                    <label htmlFor="meme">Meme</label>
                  </div>
                </div>
                <div className="image-input">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      setSelectedImage(e.target.files[0]);
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <h1>Please verify your email in order to create A post</h1>
            <p>Please check your inbox in order to verify your email.</p>
            <button onClick={sendVerification}>
              Click here to resend verification mail
            </button>
          </div>
        )
      ) : (
        <div>
          <h1>You need to be signed In to create a Post</h1>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
