import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/clientHeader.css"; // Import the CSS file
import attenailogo from "../assets/attenailogo1.png"; // Import the logo image

const ClientHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogoutClick = () => {
        // Perform logout actions (e.g., clearing user session)
        navigate("/"); // Navigate to the BlogAttenai page
    };

    return (
        <header className="clientheader-container">
            <div className="hamburger-menu" onClick={toggleSidebar}>
                ☰ {/* Hamburger menu icon */}
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
