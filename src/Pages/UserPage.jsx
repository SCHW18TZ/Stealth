import React, { useEffect, useState } from "react";
import verifiedIcon from "../assets/verifiedIcon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Link, useNavigation } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { v4 } from "uuid";
const UserPage = ({ userInfo }) => {
  const [user] = useAuthState(auth);
  const [posts, setposts] = useState([]);

  useEffect(() => {
    const userCollectionRef = collection(db, "posts");
    const queryMessages = query(
      userCollectionRef,
      where("author.uid", "==", userInfo.uid)
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setposts(messages);
    });

    return () => unsuscribe();
  }, []);

  const addchat = async () => {
    const ChatCollectionRef = collection(db, "ChatList");
    let q = query(
      ChatCollectionRef,
      where("ChatId", "==", user.uid + userInfo.uid)
    );
    let querySnap = await getDocs(q);
    if (querySnap.size > 0) {
      return;
    } else {
      addDoc(ChatCollectionRef, {
        users: [user.uid, userInfo.uid],
        usernames: [user.displayName, userInfo.name],
        createdAt: serverTimestamp(),
        ChatId: user.uid + userInfo.uid,
      });
    }
  };
  return (
    <div className="user-page-container">
      <div className="profile-container">
        <div className="left-container">
          <div className="profile-pic">
            <img src={userInfo?.profilePhoto} alt="profile pic" />
          </div>
          <div className="username-container">
            <h1>
              {userInfo?.name}
              {userInfo?.verified && (
                <img
                  src={verifiedIcon}
                  alt="verified"
                  className="verified-icon"
                />
              )}
            </h1>
            <p>{userInfo?.roles}</p>
            <p>Member Since {userInfo?.createdAt.toDate().getFullYear()}</p>
          </div>
        </div>
        <div className="middle-container">
          <h3>{userInfo?.fullName}</h3>
          <p>{userInfo?.bio}</p>
        </div>
        <div className="right-container">
          {userInfo?.uid == user?.uid ? (
            <Link to="/myaccount" state={{ userData: userInfo }}>
              <button className="edit-btn">Edit</button>
            </Link>
          ) : user ? (
            <button className="message-btn" onClick={addchat}>
              Message
            </button>
          ) : (
            <p>jnl</p>
          )}
        </div>
      </div>
      <div className="post-container">
        <h1 className="post-headings">All Posts From {userInfo.name}</h1>
        {posts.map((post) => (
          <div className="posts">
            <div className="left-post-container">
              <img src={post.image} />
            </div>
            <div className="middle-post-container">
              <h1>{post.title}</h1>
              <p>{post.description.slice(0, 100)}</p>
            </div>
            <div className="right-post-container">
              <Link to={`/post/${post.id}`}>
                <button className="Sign-in-button">View</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserPage;
