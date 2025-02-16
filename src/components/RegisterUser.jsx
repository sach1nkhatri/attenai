import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../css/RegisterUser.css";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const RegisterUser = () => {
    const [formData, setFormData] = useState({ name: "", uid: "" });
    const [status, setStatus] = useState("Start capturing images.");
    const [loading, setLoading] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRetraining, setIsRetraining] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!capturing) return;

        const interval = setInterval(() => {
            if (capturedImages.length < 100) {
                captureImage();
            } else {
                clearInterval(interval);
                setCapturing(false);
                setStatus("100 images captured. Ready to send.");
            }
        }, 300);

        return () => clearInterval(interval);
    }, [capturing, capturedImages]);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL("image/jpeg");

            setCapturedImages((prev) => [...prev, image]);
        }
    };

    const handleRegister = async () => {
        const { name, uid } = formData;
        const user = auth.currentUser;

        if (!user) {
            console.error("❌ No logged-in user.");
            return;
        }

        if (!name || !uid || capturedImages.length < 100) {
            setStatus("Ensure you capture 100 images before registering.");
            return;
        }

        try {
            setLoading(true);
            setStatus("Saving user to Firebase...");

            const userRef = collection(db, "Attendee");

            const existingDocs = await getDocs(userRef);
            const userExists = existingDocs.docs.some(doc => doc.data().uid === uid);
            if (userExists) {
                setStatus("UID already exists. Use a different UID.");
                setLoading(false);
                return;
            }

            await axios.post(
                "http://127.0.0.1:5000/register",
                { id: uid, name, images: capturedImages },
                { headers: { "Content-Type": "application/json" } }
            );

            setStatus("User registered successfully! Now assign them to a module.");
            setFormData({ name: "", uid: "" });
            setCapturedImages([]);
        } catch (error) {
            setStatus("❌ Failed to register user.");
            console.error("Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const userRef = collection(db, "Attendee");
            const userDocs = await getDocs(userRef);
            setAllUsers(userDocs.docs.map(doc => doc.data()));
        };
        fetchUsers();
    }, []);

    const handleRetrain = async () => {
        if (!selectedUser || capturedImages.length < 100) {
            setStatus("Select a user and capture 100 images.");
            return;
        }

        try {
            setLoading(true);
            setStatus("Retraining user...");

            await axios.post(
                "http://127.0.0.1:5000/register/retrain",
                { uid: selectedUser, images: capturedImages },
                { headers: { "Content-Type": "application/json" } }
            );

            setStatus("User retrained successfully!");
            setCapturedImages([]);
            setIsRetraining(false);
        } catch (error) {
            setStatus("❌ Retraining failed.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="content">
                    <h2>Register User</h2>

                    <div className="form-section">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        />
                        <input
                            type="text"
                            name="uid"
                            placeholder="UID"
                            value={formData.uid}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        />
                    </div>

                    <div className="video-section">
                        <h3>Video Feed</h3>
                        <video ref={videoRef} autoPlay className="video-feed"></video>
                        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
                    </div>

                    <div className="button-section">
                        <button onClick={() => setCapturing(true)} disabled={capturing || loading}>
                            {capturing ? "Capturing Images..." : "Start Auto-Capture"}
                        </button>
                        <button onClick={handleRegister} disabled={loading || capturedImages.length < 100}>
                            {loading ? "Registering..." : "Register & Train"}
                        </button>
                        <button onClick={() => setIsRetraining(true)}>Retrain User</button>
                    </div>

                    {isRetraining && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="close-btn" onClick={() => setIsRetraining(false)}>✖</button>
                                <h3>Select User for Retraining</h3>
                                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                    <option value="">Choose a UID</option>
                                    {allUsers.map((user) => (
                                        <option key={user.uid} value={user.uid}>{user.name} (UID: {user.uid})</option>
                                    ))}
                                </select>

                                <button onClick={() => setCapturing(true)} disabled={capturing || loading}>
                                    {capturing ? "Capturing Images..." : "Start Capturing"}
                                </button>
                                <button onClick={handleRetrain} disabled={loading || capturedImages.length < 100}>
                                    {loading ? "Retraining..." : "Retrain & Save"}
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="status-message">{status}</p>

                    <h3>Captured Images ({capturedImages.length}/100)</h3>
                    <div className="image-grid">
                        {capturedImages.map((img, index) => (
                            <img key={index} src={img} alt={`Captured ${index + 1}`} className="captured-image" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;
