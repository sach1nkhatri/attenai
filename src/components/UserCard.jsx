import React from "react";
import "../css/UserCard.css";

const UserCard = ({ user, capturedImage }) => {
    if (!user) return null;

    return (
        <div className="user-card">
            {/* Display Captured Image */}
            {capturedImage ? (
                <img src={capturedImage} alt="User" className="user-photo" />
            ) : (
                <div className="user-placeholder">No Photo Available</div>
            )}
            <div className="user-details">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>UID:</strong> {user.uid}</p>
            </div>
        </div>
    );
};

export default UserCard;
