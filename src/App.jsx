import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import UserPage from "./Pages/UserPage";
import MyAccount from "./Pages/MyAccount";
import SinglePost from "./Pages/SinglePost";
import CreatePost from "./Pages/CreatePost";
import Reset from "./Pages/Reset";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
function App() {
  const [posts, setposts] = useState([]);
  const [users, setusers] = useState([]);
  const postCollectionRef = collection(db, "posts");
  const usersCollectionRef = collection(db, "users");
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setposts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setusers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
    getUsers();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/myaccount" element={<MyAccount />} />

        {posts.map((post) => (
          <Route
            path={`/post/${post.id}`}
            element={<SinglePost post={post} />}
          />
        ))}
        {users.map((userData) => (
          <Route
            path={`/user/${userData.uid}`}
            element={<UserPage userData={userData} />}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
