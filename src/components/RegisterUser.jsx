import React, { useState } from "react";
import axios from "axios";
import { db } from "../firebaseConfig"; // Import Firebase configuration
import { collection, addDoc } from "firebase/firestore";

const RegisterUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    const [status, setStatus] = useState("");

    // Function to handle registration
    const handleRegister = async () => {
        if (!name || !email || !uid) {
            setStatus("Please fill out all fields.");
            return;
        }

        try {
            setStatus("Starting registration...");

            // Save user details to Firebase Firestore
            const userRef = collection(db, "users"); // Replace 'users' with your Firestore collection name
            await addDoc(userRef, { uid, name, email, registeredAt: new Date() });

            // Call the Flask backend to start the registration process
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
        }
    };

    // Function to handle training
    const handleTrain = async () => {
        try {
            setStatus("Training the model...");
            const response = await axios.post("http://127.0.0.1:5000/train");
            setStatus(response.data.message || "Model trained successfully!");
        } catch (error) {
            console.error("Error during training:", error.response?.data || error.message);
            setStatus("Failed to train the model. Please try again.");
        }
    };

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
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleTrain}>Train Model</button>
            <p>{status}</p>
            <h3>Video Feed</h3>
            <img src="http://127.0.0.1:5000/video_feed" alt="Video Stream" />
        </div>
    );
};

export default RegisterUser;
