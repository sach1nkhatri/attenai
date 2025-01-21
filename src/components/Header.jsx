import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import attenailogo from '../assets/attenailogo1.png';

function Header() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigation

    const openForm = () => setIsFormVisible(true);
    const closeForm = () => setIsFormVisible(false);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <header className="header-container">
            <div className="logo-title">
                <img src={attenailogo} alt="AttenAi" />
                <h1>AttenAi</h1>
            </div>
            <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                ☰ {/* Hamburger icon */}
            </div>
            <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                <a href="#home" onClick={toggleMobileMenu}>Home</a>
                <a href="#about-us" onClick={toggleMobileMenu}>About Us</a>
                <a href="#my-services" onClick={toggleMobileMenu}>Our Services</a>
                <a href="#pricing" onClick={toggleMobileMenu}>Plans</a>
                <a href="#contact-us" onClick={toggleMobileMenu}>Contact Us</a>
            </nav>
            <button className="Log-in-button" onClick={handleLoginClick}>Login</button>
        </header>
    );
}

export default Header;
