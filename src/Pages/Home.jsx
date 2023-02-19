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
    <div>
      {Loading ? (
        <div className="loading">
          <RingLoader color="#36d7b7" />
        </div>
      ) : (
        <div className="HomePage">
          <h1>All Posts</h1>
          <div className="search">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for posts"
            />
          </div>

          <div className="pt">
            {posts
              .filter((post) => {
                if (search == "") {
                  return post;
                } else if (
                  post.title.toLowerCase().includes(search.toLowerCase())
                ) {
                  return post;
                }
              })
              .map((post) => (
                <div className="posts">
                  <div className="post">
                    <img
                      src={post?.image}
                      height="200px"
                      width="200px"
                      alt=""
                    />
                    <h1>{post.title}</h1>

                    <Link to={`/post/${post.id}`}>Click here</Link>
                  </div>
                </div>
                // <div className="card">
                //   <div className="card-body">
                //     <h5 className="card-title">{post.title}</h5>
                //     <p className="card-text">{post.description}</p>
                //     <Link to={`/post/${post.id}`} className="btn btn-primary">
                //       Read more
                //     </Link>
                //   </div>
                // </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
