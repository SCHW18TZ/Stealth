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

const Inbox = () => {
  const [user] = useAuthState(auth);
  const [ChatList, setChatList] = useState([]);

  // const getChats = async () => {
  //   const ChatCollectionRef = collection(db, "ChatList");
  //   const data = await getDocs(ChatCollectionRef);
  //   const queryChat = query(
  //     ChatCollectionRef,
  //     where("users", "array-contains", user.uid),
  //     orderBy("createdAt")
  //   );
  //   const unsuscribe = onSnapshot(queryChat, (snapshot) => {
  //     let chat = [];
  //     snapshot.forEach((doc) => {
  //       chat.push({ ...doc.data(), id: doc.id });
  //     });
  //     setChatList(chat);
  //   });
  //   return () => unsuscribe();
  // };

  useEffect(() => {
    if (!user) return;
    const ChatCollectionRef = collection(db, "ChatList");
    const queryChat = query(
      ChatCollectionRef,
      where("users", "array-contains", user.uid)
    );

    const unsuscribe = onSnapshot(queryChat, (snapshot) => {
      let chats = [];
      snapshot.forEach((doc) => {
        chats.push({ ...doc.data(), id: doc.id });
      });
      setChatList(chats);
    });

    return () => unsuscribe();
  }, [user]);

  console.log(...ChatList);
  const chats = { ...ChatList };
  return (
    <div>
      {/* Map through all chats */}
      {ChatList.map((chat) => (
        <div key={chat.id}>
          <Link to={`/chat/${chat.ChatId}`}>
            {user.uid === chat.users[0] ? (
              <h2>{chat.usernames[1]}</h2>
            ) : (
              <h2>{chat.usernames[0]}</h2>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
