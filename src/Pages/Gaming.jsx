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
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    <Link to={`/post/${post.id}`}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gaming;
