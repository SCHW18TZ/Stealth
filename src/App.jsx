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
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import ChatPage from "./Pages/ChatPage";
import Inbox from "./Pages/Inbox";
function App() {
  const [userList, setUserList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const userCollectionRef = collection(db, "users");
  const chatCollectionRef = collection(db, "ChatList");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUserList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getChats = async () => {
      const data = await getDocs(chatCollectionRef);
      setChatList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
    getChats();
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
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
