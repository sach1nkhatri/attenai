// src/components/clientHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/clientHeader.css";
import attenailogo from "../assets/attenailogo1.png";

const ClientHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        navigate("/"); // Navigate to the homepage
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
