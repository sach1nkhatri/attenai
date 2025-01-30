import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, onAuthStateChanged,
    setPersistence, browserLocalPersistence
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; // Firebase Realtime Database
import '../css/Login.css';
import sinchanGif from '../assets/sinchan.gif';

const LoginSignUp = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        contactNumber: '',
        organizationName: '',
    });

    const auth = getAuth();
    const database = getDatabase();

    // ✅ Keep User Logged In (Check Auth State)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/dashboard'); // ✅ Redirect logged-in users to Dashboard
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [navigate]);

    // ✅ Ensure session persistence
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ Login Function
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/dashboard'); // ✅ Redirect after login
        } catch (error) {
            console.error('Login Error:', error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    // ✅ Sign-Up Function
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // ✅ Add user details to Realtime Database
            await set(ref(database, `Paidusers/${user.uid}`), {
                fullName: formData.fullName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                organizationName: formData.organizationName,
                createdAt: new Date().toISOString(),
            });

            alert('Sign-Up Successful!');
            setIsLogin(true); // Switch to login after successful sign-up
        } catch (error) {
            console.error('Sign-Up Error:', error.message);
            alert('Sign-Up failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            {isLogin ? (
                <div className="form-container">
                    <h2>Welcome To</h2>
                    <h1>AttenAi</h1>
                    <div className="login-box">
                        <div className="gif-container">
                            <img src={sinchanGif} alt="Sinchan GIF" />
                        </div>
                        <form onSubmit={handleLogin}> {/* Login Form */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email or Username"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Login</button>
                            <a href="#" className="forgot-pass">Forgot password?</a>
                        </form>
                        <p className="switch-form">
                            Don’t have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign Up</a>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="form-container">
                    <h2>Join Us</h2>
                    <h1>Create an Account</h1>
                    <div className="login-box">
                        <div className="gif-container">
                            <img src={sinchanGif} alt="Sinchan GIF" />
                        </div>
                        <form onSubmit={handleSignUp}> {/* Sign-Up Form */}
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="contactNumber"
                                placeholder="Contact Number"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Organization Name"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Sign Up</button>
                        </form>
                        <p className="switch-form">
                            Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginSignUp;