import React, { useRef } from "react";
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
import useSound from "use-sound";
import { Notifications } from "react-push-notification";
import addNotification from "react-push-notification";
import messageRecieveSoung from "../assets/messageRecieveSoung.mp3";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import RingLoader from "react-spinners/RingLoader";

const ChatPage = ({ chatInfo }) => {
  const refresh = () => window.location.reload(true);

  const [user] = useAuthState(auth);
  const [Message, setMessage] = useState("");
  const [Messages, setMessages] = useState([]);
  const [sendAudio] = useSound(messageRecieveSoung);
  const scrollRef = useRef();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      // check if the user is the sender
      if (messages[messages.length - 1]?.SentBy !== user.uid) {
        sendAudio();
        console.log("you received the message");
        addNotification({
          title: `New message from ${messages[messages.length - 1]?.author}`,
          subtitle: "You have a new message",
          message: messages[messages.length - 1]?.Message,
          theme: "darkblue",
          native: true, // when using native, your OS will handle theming.
        });
      } else {
        console.log("you sent the message");
      }
      setMessages(messages);
      setLoading(false);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Message == "") return;
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
      toast.success("new msg");
      sendAudio();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {Loading ? (
        <div className="loading">
          <RingLoader color="#00BFFF" loading={Loading} size={150} />
        </div>
      ) : (
        <div className="ChatPage">
          {user ? (
            user.emailVerified ? (
              <div className="ChatPage">
                <form onSubmit={handleSubmit}>
                  <input
                    required
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
                        by @{" "}
                        <Link to={`/user/${message.SentBy}`}>
                          {message.author}
                        </Link>{" "}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <h1>Please verify your email</h1>
                <button
                  onClick={() => {
                    sendEmailVerification(user);
                  }}
                >
                  Send verification email
                </button>
              </div>
            )
          ) : (
            <div>
              <h1>Please login</h1>
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
