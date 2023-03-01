import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import MyAccount from "./Pages/MyAccount";
import UserPage from "./Pages/UserPage";
import CreatePost from "./Pages/CreatePost";
import Reset from "./Pages/Reset";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "./firebase";
import ChatPage from "./Pages/ChatPage";
import SinglePost from "./Pages/SinglePost";
import Inbox from "./Pages/Inbox";
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
import addNotification from "react-push-notification";
import Gaming from "./Pages/Gaming";
import Coding from "./Pages/Coding";
import Meme from "./Pages/Meme";

import { useAuthState } from "react-firebase-hooks/auth";
function App() {
  const [userList, setUserList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [chatList, setChatList] = useState([]);
  const [postList, setPostList] = useState([]);
  const userCollectionRef = collection(db, "users");
  const chatCollectionRef = collection(db, "ChatList");
  const postCollectionRef = collection(db, "posts");
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const data = await getDocs(userCollectionRef);
      setUserList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    const getChats = async () => {
      const data = await getDocs(chatCollectionRef);
      setChatList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getPosts = async () => {
      setLoading(true);
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    getPosts();
    getUsers();
    getChats();
  }, []);

  setTimeout(() => {
    chatList.map((chat) => {
      const messagesRef = collection(db, "Messages");
      const queryMessages = query(
        messagesRef,
        where("ChatId", "==", chat.ChatId),
        orderBy("createdAt")
      );

      const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });

        if (messages[messages.length - 1]?.SentBy !== user.uid) {
          addNotification({
            title: `New message from ${messages[messages.length - 1]?.author}`,
            subtitle: "You have a new message",
            message: messages[messages.length - 1]?.Message,
            duration: 3000,
            backgroundTop: "green",
            backgroundBottom: "darkgreen",
            colorTop: "green",
            colorBottom: "darkgreen",
            closeButton: "Go away",
            theme: "red",
            native: true,
          });
        } else {
          return;
        }
      });

      return () => unsuscribe();
    });
  }, 1000);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/category/gaming" element={<Gaming />} />
        <Route path="/category/meme" element={<Meme />} />
        <Route path="/category/coding" element={<Coding />} />

        <Route path="/myaccount" element={<MyAccount />} />
        {userList.map((user) => (
          <Route
            path={`/user/${user.uid}`}
            element={<UserPage userInfo={user} />}
          />
        ))}
        {chatList.map((chat) => (
          <Route
            path={`/chat/${chat.ChatId}`}
            element={<ChatPage chatInfo={chat} />}
          />
        ))}
        {/* Dynamic routes for posts */}
        {postList.map((post) => (
          <Route
            path={`/post/${post.id}`}
            element={<SinglePost post={post} />}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
