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
import { db } from "./firebase";
import { useEffect, useRef, useState } from "react";
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
import Gaming from "./Pages/Gaming";

function App() {
  const [userList, setUserList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [postList, setPostList] = useState([]);
  const userCollectionRef = collection(db, "users");
  const chatCollectionRef = collection(db, "ChatList");
  const postCollectionRef = collection(db, "posts");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUserList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getChats = async () => {
      const data = await getDocs(chatCollectionRef);
      setChatList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
    getUsers();
    getChats();
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
        // check if the user is the sender
        if (messages[messages.length - 1].SentBy !== user.uid) {
          console.log("you received the message");
          addNotification({
            title: `New message from ${messages[messages.length - 1].author}`,
            subtitle: "You have a new message",
            message: messages[messages.length - 1].Message,
            duration: 3000, //optional, default: 5000,
            backgroundTop: "green", //optional, background color of top container.
            backgroundBottom: "darkgreen", //optional, background color of bottom container.
            colorTop: "green", //optional, font color of top container.
            colorBottom: "darkgreen", //optional, font color of bottom container.
            closeButton: "Go away", //optional, text or html/jsx element for close text. Default: Close,
            theme: "red",
            native: true, // when using native, your OS will handle theming.
          });
        } else {
          console.log("you sent the message");
        }
      });

      return () => unsuscribe();
    });
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
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/category/gaming" element={<Gaming />} />

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
