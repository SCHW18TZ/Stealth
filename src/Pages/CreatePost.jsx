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
    const meme = e.target[4].name;
    console.log(meme);
  };

  const createPost = async (e) => {
    const cat = checkbox;
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[2].value;
    if (selectedImage == null) {
      addDoc(postCollectionRef, {
        title: title,
        description: description,
        image: null,
        author: {
          name: user.displayName,
          uid: user.uid,
        },
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
            image: url,
            author: {
              name: user.displayName,
              uid: user.uid,
            },
            categories: [checkbox],
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
          <div>
            <form onSubmit={createPost} className="RegisterForm">
              <div className="inputContainer">
                <div className="input">
                  <TextField
                    required
                    id="outlined-basic"
                    type="text"
                    label="Title"
                    variant="outlined"
                  />
                </div>

                <div className="input">
                  <TextField
                    required
                    id="outlined-password-input"
                    label="Description"
                    type="text"
                    autoComplete="current-password"
                    multiline
                    rows={4}
                    className="text-field"
                  />
                </div>
                <div className="input">
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </div>
                <div>
                  categories <br />
                  <input
                    onChange={(e) => setcheckbox(e.target.name)}
                    type="checkbox"
                    name="coding"
                    id="coding"
                    for="coding"
                  />
                  <label htmlFor="coding">coding</label>
                  <input
                    onChange={(e) => setcheckbox(e.target.name)}
                    type="checkbox"
                    name="gaming"
                    id="gaming"
                    for="gaming"
                  />
                  <label htmlFor="gaming">gaming</label>
                  <input
                    onChange={(e) => setcheckbox(e.target.name)}
                    type="checkbox"
                    name="Memes"
                    id="Memes"
                    for="Memes"
                  />
                  <label htmlFor="Memes">Memes</label>
                </div>

                <div className="buttonContainer">
                  <Button
                    type="submit"
                    variant="contained"
                    className="SignInButton"
                  >
                    Make a post
                  </Button>
                </div>
              </div>
            </form>
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
