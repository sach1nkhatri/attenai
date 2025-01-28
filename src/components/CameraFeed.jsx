import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const CameraFeed = () => {
    const webcamRef = useRef(null);
    const [detectedUsers, setDetectedUsers] = useState([]);

    useEffect(() => {
        const captureAndSendFrame = async () => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    try {
                        const response = await axios.post("http://127.0.0.1:5000/recognize",
                            { image: imageSrc },
                            { headers: { "Content-Type": "application/json" } }
                        );
                        setDetectedUsers(response.data.recognized_users || []);
                    } catch (error) {
                        console.error("Error sending frame to backend:", error);
                    }
                }
            }
        };

        const interval = setInterval(captureAndSendFrame, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="camera-feed-container">
            <h2>Live Recognition Feed</h2>
            <div className="video-container">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: "100%", borderRadius: "10px" }}
                />
            </div>
            <h3>Detected Users</h3>
            <ul>
                {detectedUsers.map((user, index) => (
                    <li key={index}>{user.name} (Confidence: {user.confidence})</li>
                ))}
            </ul>
        </div>
    );
};

export default CameraFeed;
