import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

const SinglePost = ({ post }) => {
  let navigate = useNavigate();

  const postCollectionRef = collection(db, "posts");
  const commentsCollectionRef = collection(db, "comments");
  const [commentText, setcommentText] = useState("");
  const [user] = useAuthState(auth);
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    const queryMessages = query(
      commentsCollectionRef,
      where("postId", "==", post.id)
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setcomments(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText == "") return;
    await addDoc(commentsCollectionRef, {
      comment: commentText,
      name: user.displayName,
      postId: post.id,
      uid: user.uid,
    });
    setcommentText("");
    toast.success("Comment added successfully  ");
  };

  const deletePost = async () => {
    deleteDoc(doc(db, "posts", post.id)).catch((err) => {
      console.log(err);
    });
    navigate("/");
    toast.success("Post Deleted");
  };

  const deleteComment = async (id) => {
    const commentDoc = doc(db, "comments", id);
    await deleteDoc(commentDoc);
  };

  return (
    <div className="SinglePostPage">
      <Toaster />
      {/* Check if image exits and display it */}
      {post?.image && (
        <img
          src={post?.image}
          className="PostImage"
          height="200px"
          alt="post"
        />
      )}
      <h1>{post.title}</h1>
      <h3>Categories</h3>
      {post.categories.map((category) => (
        // add space in between categories
        <Link to={`/category/${category}`}>{category + " "}</Link>
      ))}

      <p>{post.description}</p>
      <Link to={`/user/${post.author.uid}`}>by {post.author.name}</Link>
      {post.author.uid == user?.uid && (
        <Button variant="primary" onClick={deletePost}>
          Delete Post
        </Button>
      )}
      <div className="comments">
        {user ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="type a comment"
              value={commentText}
              onChange={(e) => setcommentText(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Comment
            </Button>
          </form>
        ) : (
          <h1>Login to post comments</h1>
        )}

        <h1>Comments</h1>
        {comments.map((comment) => (
          <div>
            <h2>{comment.comment}</h2>
            <Link to={`/user/${comment.uid}`}>{comment.name}</Link>
            {user?.uid == comment.uid ? (
              <Button
                variant="primary"
                onClick={() => {
                  deleteComment(comment.id);
                }}
              >
                Delete Comment
              </Button>
            ) : (
              console.log("user")
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePost;
