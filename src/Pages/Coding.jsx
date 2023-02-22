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

const Coding = () => {
  // Function to get all posts from the database with Coding category

  const [CodingPosts, setCodingPosts] = useState([]);

  const getCodingPosts = async () => {
    const postsCollectionRef = collection(db, "posts");
    const queryPosts = query(
      postsCollectionRef,
      where("categories", "array-contains", "coding")
    );
    const unsuscribe = onSnapshot(queryPosts, (snapshot) => {
      let posts = [];
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setCodingPosts(posts);
    });
    return () => unsuscribe();
  };

  useEffect(() => {
    getCodingPosts()
      .then(() => console.log(CodingPosts))
      .catch(console.error);
  }, [CodingPosts]);

  return (
    <div className="container">
      <div className="row">
        {CodingPosts.map((post) => (
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

export default Coding;
