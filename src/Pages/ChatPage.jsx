import React from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";

const ChatPage = ({ chatInfo }) => {
  const [user] = useAuthState(auth);
  const [Message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const MessageCollectionRef = collection(db, "Messages");
      addDoc(MessageCollectionRef, {
        Message: Message,
        createdAt: serverTimestamp(),
        SentBy: user.uid,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ChatPage">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send a message</button>
      </form>
    </div>
  );
};

export default ChatPage;
