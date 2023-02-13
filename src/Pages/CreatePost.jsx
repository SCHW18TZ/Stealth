import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from "../firebase";
import { Link } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
const CreatePost = () => {
  const [user] = useAuthState(auth);

  const sendVerificationEmail = async () => {
    const result = await sendEmailVerification(user);
    console.log(result);
  };

  return (
    <div>
      {user ? (
        user.emailVerified ? (
          <div className="CreatePostPage">
            <h1>Create A post</h1>
            <div className="CreatePostForm">
              <form>
                <input type="text" placeholder="Title..." />
                <textarea
                  name="desc"
                  cols="30"
                  rows="10"
                  placeholder="Description..."
                ></textarea>
                <input type="file" accept="image/*" />
              </form>
            </div>
          </div>
        ) : (
          <div>
            <h1>Please verify your email in order to create A post</h1>
            <p>Please check your inbox in order to verify your email.</p>
            <button onClick={sendVerificationEmail}>
              Click here to resend verification mail
            </button>
          </div>
        )
      ) : (
        <div
          className="unauthoris
        zed"
        >
          <p>You need to login first to create a post!</p>
          <Link to="/login">Login here</Link>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
