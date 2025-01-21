import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig"; // Import Firebase configuration
import { collection, addDoc } from "firebase/firestore";

const RegisterUser = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState("");
    const [detectedUser, setDetectedUser] = useState(null); // State for detected user
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1];
        setImages((prevImages) => [...prevImages, imageBase64]);
    };

    const startCapturing = () => {
        setStatus("");
        setImages([]);
        setIsCapturing(true);

        let captureInterval = setInterval(capturePhoto, 300); // Capture every 300ms
        setTimeout(() => {
            clearInterval(captureInterval);
            setIsCapturing(false);
            setStatus("Finished capturing images.");
        }, 15000); // Stop after 15 seconds
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!name || !email || !uid) {
            setStatus("Please fill out all fields.");
            return;
        }

        if (images.length < 10) {
            setStatus("Please capture at least 10 images for training.");
            return;
        }

        try {
            setStatus("Registering user...");

            // Store user details in Firebase
            const userRef = collection(db, "users");
            await addDoc(userRef, { uid, name, email, registeredAt: new Date() });

            // Send images to the Flask backend
            const response = await axios.post("http://127.0.0.1:5000/register", {
                id: uid,
                name,
                email,
                images,
            });

            setStatus(response.data.message || "User registered successfully!");
            setName("");
            setEmail("");
            setUID("");
            setImages([]);
        } catch (error) {
            console.error("Error registering user:", error.response?.data || error.message);
            setStatus("Failed to register user. Please try again.");
        }
    };

    const handleTrain = async () => {
        try {
            setStatus("Training model...");
            const response = await axios.post("http://127.0.0.1:5000/train");
            setStatus(response.data.message || "Model trained successfully!");
        } catch (error) {
            console.error("Error training model:", error.response?.data || error.message);
            setStatus("Failed to train the model. Please try again.");
        }
    };

    const detectUser = async (imageBase64) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/recognize", {
                image: imageBase64,
            });

            if (response.data.success) {
                setDetectedUser(response.data.user);
                setStatus(`User recognized: ${response.data.user.name}`);
            } else {
                setDetectedUser(null); // Clear user card if not recognized
                setStatus(response.data.message || "Face not recognized.");
            }
        } catch (error) {
            console.error("Error recognizing face:", error.message);
            setStatus("Error recognizing face.");
        }
    };

    const startDetection = () => {
        const interval = setInterval(() => {
            if (!videoRef.current || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1];
            detectUser(imageBase64);
        }, 3000); // Detect every 3 seconds

        return () => clearInterval(interval);
    };

    useEffect(() => {
        const detectionInterval = startDetection();
        return () => detectionInterval(); // Cleanup interval
    }, []);

    return (
        <div className="register-user">
            <h2>Register User</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>UID</label>
                    <input
                        type="text"
                        value={uid}
                        onChange={(e) => setUID(e.target.value)}
                        required
                    />
                </div>
                <div className="camera-section">
                    <video ref={videoRef} autoPlay muted width="100%" />
                    <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                    {isCapturing ? (
                        <p>Capturing images... ({images.length} captured)</p>
                    ) : (
                        <button type="button" onClick={startCapturing}>
                            Start Capturing Images
                        </button>
                    )}
                </div>
                <button type="submit" disabled={isCapturing}>
                    Register
                </button>
            </form>
            <button type="button" onClick={handleTrain} disabled={isCapturing || status.includes("Training")}>
                Train Model
            </button>
            {status && <p className="status">{status}</p>}
            {detectedUser && (
                <div className="user-popup">
                    <h3>User Detected</h3>
                    <p><strong>Name:</strong> {detectedUser.name}</p>
                    <p><strong>Email:</strong> {detectedUser.email}</p>
                    <p><strong>UID:</strong> {detectedUser.uid}</p>
                </div>
            )}
        </div>
    );
};

export default RegisterUser;
