import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import UserCard from "./UserCard";
import "../css/CameraFeed.css";
import axios from "axios";

const CameraFeed = () => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("Waiting for recognition...");
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        };
        loadModels();
    }, []);

    const handleCapture = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const cleanedImage = imageSrc.replace(/^data:image\/\w+;base64,/, "");
            try {
                const response = await axios.post("http://127.0.0.1:5000/recognize", { image: cleanedImage });
                if (response.data.success) {
                    if (!user || user.uid !== response.data.user.uid) {
                        // Update user only if it's a new user or the first recognition
                        setUser(response.data.user);
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

    useEffect(() => {
        const interval = setInterval(() => {
            handleCapture();
        }, 3000); // Capture every 3 seconds
        return () => clearInterval(interval);
    }, [user]); // Only re-run if the user state changes

    return (
        <div className="camera-feed-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <canvas ref={canvasRef} className="face-canvas"></canvas>
            <div className="status-container">
                <p className="status">{status}</p>
            </div>
            {user && <UserCard user={user} />} {/* Keep UserCard visible */}
        </div>
    );
};

export default CameraFeed;
