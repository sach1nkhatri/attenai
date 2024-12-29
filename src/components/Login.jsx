import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/Login.css';
import sinchanGif from '../assets/sinchan.gif';

const Login = () => {
    const navigate = useNavigate(); // Initialize navigation

    const handleLogin = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate('/dashboard'); // Navigate to the dashboard
    };

    return (
        <div className="login-container">
            <h2>Welcome To</h2>
            <h1>AttenAi</h1>
            <div className="login-box">
                <div className="icon">
                    <img src={sinchanGif} alt="Icon"/>
                </div>
                <form onSubmit={handleLogin}> {/* Attach onSubmit handler */}
                    <input type="text" placeholder="Email or Username" required/>
                    <input type="password" placeholder="Password" required/>
                    <button type="submit">Login</button>
                    {/* Button triggers form submission */}
                    <a href="#" className="forgot-pass">Forgot password?</a>
                </form>
            </div>
            <footer className="login-footer">
                <p>&copy; 2024 Bad Boy Detector. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Login;
