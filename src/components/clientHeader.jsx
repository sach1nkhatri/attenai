// src/components/ClientHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../css/clientHeader.css";
import attenailogo from "../assets/attenailogo1.png";

const ClientHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const auth = getAuth(); // ✅ Get Firebase Auth instance

    const handleLogoutClick = async () => {
        try {
            await signOut(auth); // ✅ Logs out user from Firebase
            navigate("/"); // ✅ Redirect to login/home page after logout
        } catch (error) {
            console.error("Logout Error:", error.message);
            alert("Failed to log out. Please try again.");
        }
    };

    return (
        <header className="clientheader-container">
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
            </div>
            <div className="clientlogo-title">
                <img src={attenailogo} alt="AttenAi" />
                <h1>AttenAi</h1>
            </div>
            <button className="log-out-button" onClick={handleLogoutClick}>
                Logout
            </button>
        </header>
    );
};

export default ClientHeader;
