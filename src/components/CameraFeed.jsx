import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const CameraFeed = () => {
    const webcamRef = useRef(null);
    const videoRef = useRef(null); // Used for CCTV API feed
    const [detectedUsers, setDetectedUsers] = useState([]);
    const [cameraMode, setCameraMode] = useState("local");
    const [cctvApiUrl, setCctvApiUrl] = useState("");

    useEffect(() => {
        const fetchCameraSettings = async () => {
            const orgDoc = await getDoc(doc(db, "Organizations", "org_123"));
            if (orgDoc.exists()) {
                const data = orgDoc.data();
                setCameraMode(data.cameraMode);
                setCctvApiUrl(data.cctvApiUrl);
            }
        };

        fetchCameraSettings();
    }, []);

    useEffect(() => {
        const captureAndSendFrame = async () => {
            if (cameraMode === "local" && webcamRef.current) {
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

        const interval = setInterval(captureAndSendFrame, 1000);
        return () => clearInterval(interval);
    }, [cameraMode]);

    return (
        <div className="camera-feed-container">
            <h2>Live Recognition Feed</h2>
            <div className="video-container">
                {cameraMode === "local" ? (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        style={{ width: "100%", borderRadius: "10px" }}
                    />
                ) : (
                    <video ref={videoRef} src={cctvApiUrl} autoPlay controls className="cctv-feed" />
                )}
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
