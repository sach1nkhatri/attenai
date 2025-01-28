import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const RegisterUser = () => {
    const [formData, setFormData] = useState({ name: "", uid: "" });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [capturing, setCapturing] = useState(false);

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
            if (capturedImages.length < 50) {
                captureImage();
            } else {
                clearInterval(interval);
                setCapturing(false);
                setStatus("50 images captured. Ready to send.");
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
        }
    };

    const handleRegister = async () => {
        const { name, uid } = formData;
        if (!name || !uid || capturedImages.length < 50) {
            setStatus("Ensure you capture 50 images before registering.");
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
                "http://127.0.0.1:5000/register/",
                { id: uid, name, images: capturedImages },
                { headers: { "Content-Type": "application/json" } }
            );

            setStatus("User registered and trained successfully!");
            setFormData({ name: "", uid: "" });
            setCapturedImages([]);
        } catch (error) {
            setStatus("Failed to register user.");
            console.error("Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register User</h2>
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

            <div>
                <h3>Video Feed</h3>
                <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "400px", border: "1px solid black" }}></video>
                <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
            </div>

            <button onClick={() => setCapturing(true)} disabled={capturing || loading}>
                {capturing ? "Capturing Images..." : "Start Auto-Capture"}
            </button>
            <button onClick={handleRegister} disabled={loading || capturedImages.length < 50}>
                {loading ? "Registering..." : "Register & Train"}
            </button>

            <p>{status}</p>

            <h3>Captured Images</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {capturedImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Captured ${index + 1}`}
                        style={{ width: "100px", height: "100px", margin: "5px", border: "1px solid black" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RegisterUser;
