import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig"; // Import Firebase configuration
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const RegisterUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [recognizedUsers, setRecognizedUsers] = useState([]);

    // Function to validate email
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    // Function to handle registration
    const handleRegister = async () => {
        if (!name || !email || !uid) {
            setStatus("Please fill out all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            setStatus("Please enter a valid email.");
            return;
        }

        try {
            setStatus("Checking for duplicate UID...");
            setLoading(true);

            // Check if UID already exists in Firebase Firestore
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", uid));
            const existingDocs = await getDocs(q);

            if (!existingDocs.empty) {
                setStatus("UID already exists. Please use a different UID.");
                setLoading(false);
                return;
            }

            // Save user details to Firebase Firestore
            setStatus("Saving user to Firebase...");
            await addDoc(userRef, { uid, name, email, registeredAt: new Date() });

            // Call the Flask backend to start the registration process
            setStatus("Registering user with backend...");
            const response = await axios.post("http://127.0.0.1:5000/register", {
                id: uid,
                name,
                email,
            });

            setStatus(response.data.message || "User registered successfully!");
            setName("");
            setEmail("");
            setUID("");
        } catch (error) {
            console.error("Error during registration:", error.response?.data || error.message);
            setStatus("Failed to register user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to handle training
    const handleTrain = async () => {
        try {
            setStatus("Training the model...");
            setLoading(true);

            // Call the Flask backend to train the model
            const response = await axios.post("http://127.0.0.1:5000/train");
            setStatus(response.data.message || "Model trained successfully!");
        } catch (error) {
            console.error("Error during training:", error.response?.data || error.message);
            setStatus("Failed to train the model. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to handle user detection
    const handleDetectUser = async () => {
        try {
            setStatus("Detecting users...");
            setLoading(true);

            // Call the Flask backend to recognize users
            const response = await axios.get("http://127.0.0.1:5000/recognized_user");
            const users = response.data.recognized_users;

            setRecognizedUsers(users);
            setStatus("User detection successful!");
        } catch (error) {
            console.error("Error during user detection:", error.response?.data || error.message);
            setStatus("Failed to detect users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Effect to reset status after a delay
    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => setStatus(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div>
            <h2>Register User</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="UID"
                value={uid}
                onChange={(e) => setUID(e.target.value)}
            />
            <button onClick={handleRegister} disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
            <button onClick={handleTrain} disabled={loading}>
                {loading ? "Training..." : "Train Model"}
            </button>
            <button onClick={handleDetectUser} disabled={loading}>
                {loading ? "Detecting..." : "Detect User"}
            </button>
            <p>{status}</p>
            <h3>Video Feed</h3>
            <img
                src="http://127.0.0.1:5000/video_feed"
                alt="Video Stream"
                style={{ border: "1px solid black", width: "100%", maxHeight: "400px" }}
            />
            <h3>Recognized Users</h3>
            <ul>
                {recognizedUsers.map((user, index) => (
                    <li key={index}>
                        {user.name} (ID: {user.id}) - Confidence: {user.confidence}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RegisterUser;
