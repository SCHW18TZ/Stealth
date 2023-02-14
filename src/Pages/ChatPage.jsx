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

const ChatPage = ({ chatInfo }) => {
  const [user] = useAuthState(auth);
  const [Message, setMessage] = useState("");
  const [Messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "Messages");
    const queryMessages = query(
      messagesRef,
      where("ChatId", "==", chatInfo.ChatId),
      orderBy("createdAt")
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const MessageCollectionRef = collection(db, "Messages");
      addDoc(MessageCollectionRef, {
        Message: Message,
        createdAt: serverTimestamp(),
        SentBy: user.uid,
        author: user.displayName,
        ChatId: chatInfo.ChatId,
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
          value={Message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send a message</button>
      </form>
      {Messages.map((message) => {
        return (
          <div
            className={`message ${
              message.SentBy === user.uid ? "sent" : "received"
            }`}
          >
            <p>{message.Message}</p>
            <p>
              by @ <Link to={`/user/${message.sentBy}`}>{message.author}</Link>{" "}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatPage;
