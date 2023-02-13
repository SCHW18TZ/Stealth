import React from "react";
import verifiedIcon from "../assets/verifiedIcon.jpg";

const UserPage = ({ user }) => {
  const date = user.createdAt.toDate();
  console.log(date);

  return (
    <div className="user-page-container">
      <div className="profile-container">
        <div className="profile-pic">
          <img src={user.profilePhoto} alt="profile pic" />
        </div>
        <div className="username-container">
          <h1>
            {user.name}
            <span>
              {user.verified && <img src={verifiedIcon} alt="verified" />}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
