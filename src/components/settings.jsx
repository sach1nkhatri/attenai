import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import "../css/settings.css";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const Settings = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({
        fullName: "",
        contactNumber: "",
        email: "",
        organizationName: "",
    });
    const [cameraSettings, setCameraSettings] = useState({
        cameraMode: "local",
        apiKey: "",
        cctvApiUrl: "",
    });
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editingUser, setEditingUser] = useState({});
    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "Users", "NsnKRYP7bUN33Tqczkgy0I6QwXb2")); // Replace with dynamic ID
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }

                const cameraDoc = await getDoc(doc(db, "Settings", "camera_settings"));
                if (cameraDoc.exists()) {
                    setCameraSettings(cameraDoc.data());
                }
            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };

        fetchUserData();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleEditPopup = () => {
        setEditingUser(user);
        setIsEditPopupOpen(!isEditPopupOpen);
    };

    const handleUserChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

    const handleCameraChange = (e) => {
        setCameraSettings({ ...cameraSettings, cameraMode: e.target.value });

        if (e.target.value === "cctv") {
            const newCctvUrl = prompt("Enter CCTV API URL:");
            if (newCctvUrl) {
                setCameraSettings({ ...cameraSettings, cctvApiUrl: newCctvUrl });
            }
        }
    };

    const saveUserInfo = async () => {
        try {
            await updateDoc(doc(db, "Users", "NsnKRYP7bUN33Tqczkgy0I6QwXb2"), editingUser);
            setUser(editingUser);
            setIsEditPopupOpen(false);
            alert("User information updated successfully!");
        } catch (error) {
            console.error("Error updating user info:", error);
            alert("Failed to update user info.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Successfully logged out.");
            window.location.reload(); // Reload page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="settings-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <Header toggleSidebar={toggleSidebar} />

                <div className="content">
                    <h2>Settings</h2>

                    {/* 📌 User Settings */}
                    <div className="settings-section user-settings">
                        <h3>User Settings</h3>
                        <p><strong>Organization:</strong> {user.organizationName}</p>
                        <p><strong>Account Holder:</strong> {user.fullName}</p>
                        <p><strong>Contact:</strong> {user.contactNumber}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button className="edit-button" onClick={toggleEditPopup}>Edit</button>
                    </div>

                    {/* 📌 Camera Settings */}
                    <div className="settings-section">
                        <h3>Camera Settings</h3>
                        <label>Select Camera Source:</label>
                        <select value={cameraSettings.cameraMode} onChange={handleCameraChange}>
                            <option value="local">Local Webcam</option>
                            <option value="cctv">CCTV API</option>
                        </select>

                        <div className="input-group">
                            <label>API Key</label>
                            <input
                                type="text"
                                placeholder="Enter API Key"
                                value={cameraSettings.apiKey}
                                onChange={(e) => setCameraSettings({ ...cameraSettings, apiKey: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* 📌 Contact Us */}
                    <div className="settings-section">
                        <h3>Contact Us</h3>
                        <p>Email: <a href="mailto:support@attenai.com">support@attenai.com</a></p>
                        <p>Phone: +977-9810392313</p>
                    </div>

                    {/* 📌 About Us */}
                    <div className="settings-section">
                        <h3>About Us</h3>
                        <p>AttenAi is an advanced AI-based attendance management system designed to automate attendance tracking using facial recognition.</p>
                    </div>

                    {/* 📌 Logout Button */}
                    <div className="settings-section logout-section">
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>

            {/* 📌 Edit User Info Popup with Blurred Background */}
            {isEditPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Edit User Information</h3>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={editingUser.fullName} onChange={handleUserChange} />
                        </div>
                        <div className="input-group">
                            <label>Contact Number</label>
                            <input type="text" name="contactNumber" value={editingUser.contactNumber} onChange={handleUserChange} />
                        </div>
                        <button className="save-button" onClick={saveUserInfo}>Save Changes</button>
                        <button className="cancel-button" onClick={toggleEditPopup}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
