import React from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Gaming = () => {
  // Function to get all posts from the database with gaming category

  const [GamingPosts, setGamingPosts] = useState([]);

  const getGamingPosts = async () => {
    const postsCollectionRef = collection(db, "posts");
    const queryPosts = query(
      postsCollectionRef,
      where("categories", "array-contains", "gaming")
    );
    const unsuscribe = onSnapshot(queryPosts, (snapshot) => {
      let posts = [];
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setGamingPosts(posts);
    });
    return () => unsuscribe();
  };

  useEffect(() => {
    getGamingPosts()
      .then(() => console.log(GamingPosts))
      .catch(console.error);
  }, [GamingPosts]);

  return (
    <div className="container">
      <div className="row">
        {GamingPosts.map((post) => (
          <div key={post.id} className="posts">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
                <Link to={`/post/${post.id}`} className="btn btn-primary">
                  Read more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gaming;
