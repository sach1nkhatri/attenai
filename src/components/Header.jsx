import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/Header.css"; // Import the CSS file
import attenailogo from "../assets/attenailogo1.png"; // Import the logo image

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginClick = () => {
        navigate("/login"); // Navigate to the Login page
    };

    return (
        <header className="header-container">
            <div className="logo-title">
                <img src={attenailogo} alt="AttenAi" />
                <h1>AttenAi</h1>
            </div>
            <nav className="nav-links">
                <a href="#home">Home</a>
                <a href="#about-us">About Us</a>
                <a href="#my-services">Our Services</a>
                <a href="#pricing">Plans</a>
                <a href="#contact-us">Contact Us</a>
            </nav>
            <button className="log-in-button" onClick={handleLoginClick}>
                Client Area
            </button>
        </header>
    );
};

export default Header;
