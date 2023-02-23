import React, { useEffect, useState } from "react";
import verifiedIcon from "../assets/verifiedIcon.png";
import developerIcon from "../assets/developerIcon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Link, useNavigation } from "react-router-dom";
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
  serverTimestamp,
  where,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { toast, Toaster } from "react-hot-toast";
const UserPage = ({ userInfo }) => {
  const [user] = useAuthState(auth);
  const [posts, setposts] = useState([]);
  const [Following, setFollowing] = useState(false);
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

  // get all roles of user
  const roles = userInfo.roles;

  // const UnFollowUser = async () => {
  //   try {
  //     const userCollectionRef = collection(db, "users");
  //     const queryMessages = query(
  //       userCollectionRef,
  //       where("following", "array-contains", userInfo.uid)
  //     );
  //     const querySnap = await getDocs(queryMessages);
  //     querySnap.forEach(async (doc) => {
  //       const userDoc = doc.id;
  //       await updateDoc(doc.ref, {
  //         followers: arrayRemove(user.uid),
  //       });
  //     });
  //   } catch (err) {
  //     toast.error("Something went wrong" + err.message);
  //     console.log(err);
  //   }
  // };

  const FollowUser = async () => {
    try {
      // query to get the user document

      const userCollectionRef = collection(db, "users");
      const queryMessages = query(
        userCollectionRef,
        where("uid", "==", userInfo.uid)
      );
      const querySnap = await getDocs(queryMessages);
      querySnap.forEach(async (doc) => {
        const userDoc = doc.id;
        // update the user document to add the current user to the followers array
        await updateDoc(doc.ref, {
          followers: arrayUnion(user.uid),
        });
      });

      const currentUserQuery = query(
        userCollectionRef,
        where("uid", "==", user.uid)
      );
      const CurrectUserQuerySnap = await getDocs(currentUserQuery);
      CurrectUserQuerySnap.forEach(async (doc) => {
        const CurrentUser = doc.id;
        await updateDoc(doc.ref, {
          following: arrayUnion(userInfo.uid),
        });
      });

      toast.success("Followed");
      setFollowing(true);
    } catch (err) {
      toast.error("Something went wrong" + err.message);
      console.log(err);
    }
  };

  // loop through roles and log each role

  return (
    <div className="user-page-container">
      <Toaster />
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

              {userInfo?.roles.includes("developer") && (
                <img
                  style={{ width: '"20px"', height: "20px", color: "white" }}
                  src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Circle-icons-dev.svg"
                  alt="developer"
                  className="verified-icon"
                />
              )}
              {userInfo?.roles.includes("designer") && (
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/designer.png"
                  alt="designer"
                  className="verified-icon"
                />
              )}
              {userInfo?.roles.includes("owner") && (
                <img
                  src="https://www.adanigas.com/-/media/Project/AdaniGas/AboutUs/Board-Of-Directors/gautam-adani/Gautam_Adani_Chairman_Adani_Group.jpg?la=en&hash=BBD9E0EEF84B3D5DD1B2FFDD5BEFDB1C"
                  alt="owner"
                  className="verified-icon"
                />
              )}
            </h1>
            {userInfo?.roles.includes("developer") && <p>Developer</p>}
            {userInfo?.roles.includes("designer") && <p>Designer</p>}
            {userInfo?.roles.includes("owner") && <p>Owner</p>}

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
            <>
              <button className="message-btn" onClick={addchat}>
                Message
              </button>
              {!Following ? (
                <button className="message-btn">Unfollow</button>
              ) : (
                <button onClick={FollowUser} classname="message-btn">
                  Follow
                </button>
              )}
            </>
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
