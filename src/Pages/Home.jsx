import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import addNotification from "react-push-notification";
import RingLoader from "react-spinners/RingLoader";
const Home = () => {
  const [chatList, setChatList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const postCollectionRef = collection(db, "posts");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  // Make home page scrollable
  document.body.style.overflow = "auto";

  const [user] = useAuthState(auth);
  let navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const data = await getDocs(postCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    getPosts();
  }, []);

  return (
    <div className="HomePage">
      <header className="header">
        <h1>Home</h1>
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for posts"
          />
          <FontAwesomeIcon icon={faSearch} color="white" className="icon" />
        </div>
      </header>
      {Loading ? (
        <div className="loading">
          <RingLoader color="#36d7b7" />
        </div>
      ) : (
        <div className="post-container">
          {posts
            .filter((post) => {
              if (search == "") {
                return post;
              } else if (
                post?.title.toLowerCase().includes(search.toLowerCase())
              ) {
                return post;
              }
            })
            .map((post) => (
              <div className="posts">
                <div className="left-post-container">
                  <img src={post?.image} />
                </div>
                <div className="middle-post-container">
                  <h1>{post?.title}</h1>
                  <p>{post?.description}</p>
                  <Link to={`/user/${post.author.uid}`}>
                    {" "}
                    by @{post?.author.name}
                  </Link>
                </div>
                <div className="right-post-container">
                  <Link to={`/post/${post.id}`}>
                    <button className="Sign-in-button">View</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
