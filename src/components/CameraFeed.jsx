import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CameraFeed.css";

const CameraFeed = () => {
    const [status, setStatus] = useState("Connecting to the video feed...");
    const [recognizedUser, setRecognizedUser] = useState(null); // Holds the recognized user data

    // Function to fetch recognized user data periodically
    const fetchRecognizedUser = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/recognized_user");
            if (response.data.success) {
                setRecognizedUser(response.data.user);
            } else {
                setRecognizedUser(null);
            }
        } catch (error) {
            console.error("Network error:", error.message);
            setStatus("Cannot connect to backend.");
        }
    };


    // Periodically fetch recognized user data every 3 seconds
    useEffect(() => {
        const interval = setInterval(fetchRecognizedUser, 3000);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="camera-feed-container">
            <h2>Camera Feed</h2>
            {/* Video feed streamed from the backend */}
            <div className="video-container">
                <img
                    src="http://127.0.0.1:5000/video_feed"
                    alt="Video Stream"
                    style={{ width: "100%", borderRadius: "10px" }}
                />
                <p className="status">{status}</p>
            </div>

            {/* Popup for recognized user */}
            {recognizedUser && (
                <div className="user-popup">
                    <h3>User Detected</h3>
                    <p><strong>Name:</strong> {recognizedUser.name}</p>
                    <p><strong>Email:</strong> {recognizedUser.email}</p>
                    <p><strong>UID:</strong> {recognizedUser.uid}</p>
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
