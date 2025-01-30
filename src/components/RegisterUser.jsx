import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import "../css/RegisterUser.css"; // ✅ Import CSS for styling
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const RegisterUser = () => {
    const [formData, setFormData] = useState({ name: "", uid: "" });
    const [status, setStatus] = useState("Start capturing images.");
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [capturing, setCapturing] = useState(false);
    const [step, setStep] = useState(1); // 1 = Close, 2 = Far
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Auto-capture images when a face is detected
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
        }, 300); // Capture every 300ms

        return () => clearInterval(interval);
    }, [capturing, capturedImages]);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL("image/jpeg");

            setCapturedImages((prev) => [...prev, image]);

            // Switch message when reaching 50 images
            if (capturedImages.length === 49) {
                setStatus("Move further away for the next 50 images.");
                setStep(2);
            }
        }
    };

    const handleRegister = async () => {
        const { name, uid } = formData;
        if (!name || !uid || capturedImages.length < 100) {
            setStatus("Ensure you capture 100 images before registering.");
            return;
        }

        try {
            setLoading(true);
            setStatus("Saving user to Firebase...");
            const userRef = collection(db, "Attendee");
            const q = query(userRef, where("uid", "==", uid));
            const existingDocs = await getDocs(q);
            if (!existingDocs.empty) {
                setStatus("UID already exists. Use a different UID.");
                setLoading(false);
                return;
            }
            await addDoc(userRef, { uid, name, registeredAt: new Date() });

            setStatus("Sending images to backend...");
            await axios.post(
                "http://127.0.0.1:5000/register",
                { id: uid, name, images: capturedImages },
                { headers: { "Content-Type": "application/json" } }
            );

            setStatus("User registered and trained successfully!");
            setFormData({ name: "", uid: "" });
            setCapturedImages([]);
            setStep(1); // Reset for next registration
        } catch (error) {
            setStatus("Failed to register user.");
            console.error("Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="register-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <Header toggleSidebar={toggleSidebar} />
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
                    </div>

                    <p className={`status-message ${step === 1 ? "blue-text" : "red-text"}`}>
                        {status}
                    </p>

                    <h3>Captured Images ({capturedImages.length}/100)</h3>
                    <div className="image-grid">
                        {capturedImages.map((img, index) => (
                            <img key={index} src={img} alt={`Captured ${index + 1}`} className="captured-image" />
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ Register Footer */}
            <footer className="register-footer">
                <p>
                    &copy; 2025 AttenAi | Developed By{' '}
                    <a href="https://sachin.bio/" target="_blank" rel="noopener noreferrer">
                        Sachin Khatri
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default RegisterUser;
