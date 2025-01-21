import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import UserCard from "./UserCard";
import "../css/CameraFeed.css";
import axios from "axios";

const CameraFeed = () => {
    const [user, setUser] = useState(null); // State for the latest recognized user
    const [status, setStatus] = useState("Waiting for recognition...");
    const [capturedImage, setCapturedImage] = useState(null); // Captured image for the user card
    const webcamRef = useRef(null);

    // Load face-api.js models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
                setStatus("Models loaded. Ready for recognition.");
            } catch (error) {
                console.error("Error loading models:", error);
                setStatus("Failed to load face recognition models.");
            }
        };

        loadModels();
    }, []);

    // Handle capturing an image and recognizing the user
    const handleCapture = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot(); // Capture a frame from the webcam
        if (imageSrc) {
            const cleanedImage = imageSrc.replace(/^data:image\/\w+;base64,/, "");
            try {
                const response = await axios.post("http://127.0.0.1:5000/recognize", { image: cleanedImage });
                if (response.data.success) {
                    if (!user || user.uid !== response.data.user.uid) {
                        // Update user state and save the captured image
                        setUser(response.data.user);
                        setCapturedImage(imageSrc); // Save the captured image
                        setStatus(`User recognized: ${response.data.user.name}`);
                    }
                } else {
                    setStatus(response.data.message || "Face not recognized.");
                }
            } catch (error) {
                console.error("Error recognizing face:", error);
                setStatus("Error recognizing face.");
            }
        }
    };

    // Periodically capture frames for recognition
    useEffect(() => {
        const interval = setInterval(() => {
            handleCapture();
        }, 3000); // Capture every 3 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [user]);

    return (
        <div className="camera-feed-container">
            {/* Camera Feed */}
            <div className="webcam-container">
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
                <div className="status-container">
                    <p className="status">{status}</p>
                </div>
            </div>
            {/* User Card Below */}
            {user && (
                <div className="user-card-container">
                    <UserCard user={user} capturedImage={capturedImage} />
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
