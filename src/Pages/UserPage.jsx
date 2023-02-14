import React, { useState } from "react";
import verifiedIcon from "../assets/verifiedIcon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Link, useNavigation } from "react-router-dom";

const UserPage = ({ userInfo }) => {
  const [user] = useAuthState(auth);

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
            <Link to="/myaccount">
              <button className="edit-btn">Edit</button>
            </Link>
          ) : (
            <button className="message-btn">Message</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserPage;
