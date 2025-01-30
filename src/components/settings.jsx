import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../css/settings.css";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const Settings = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [organization, setOrganization] = useState({
        name: "",
        subscription: "",
        renewalDate: "",
        cameraMode: "local", // Default to local camera
        cctvApiUrl: "",
    });
    const [modules, setModules] = useState([]);
    const [moduleCameraAssignments, setModuleCameraAssignments] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const orgDoc = await getDoc(doc(db, "Organizations", "org_123")); // Replace with dynamic ID
                if (orgDoc.exists()) {
                    setOrganization(orgDoc.data());
                }

                // Fetch modules
                const modulesSnapshot = await getDocs(collection(db, "Modules"));
                const modulesData = modulesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    assignedCameraApi: doc.data().cameraApi || "Not Assigned",
                }));
                setModules(modulesData);

                // Fetch camera API assignments
                const assignments = {};
                modulesData.forEach(module => {
                    assignments[module.id] = module.assignedCameraApi;
                });
                setModuleCameraAssignments(assignments);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCameraChange = (e) => {
        const newCameraMode = e.target.value;
        setOrganization(prev => ({ ...prev, cameraMode: newCameraMode }));

        if (newCameraMode === "cctv") {
            const newCctvUrl = prompt("Enter CCTV API URL:");
            if (newCctvUrl) {
                setOrganization(prev => ({ ...prev, cctvApiUrl: newCctvUrl }));
            }
        }
    };

    const handleModuleCameraChange = (moduleId, newApiUrl) => {
        setModuleCameraAssignments(prev => ({
            ...prev,
            [moduleId]: newApiUrl,
        }));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Save organization settings
            await updateDoc(doc(db, "Organizations", "org_123"), organization);

            // Save camera assignments to modules
            for (const [moduleId, cameraApi] of Object.entries(moduleCameraAssignments)) {
                await updateDoc(doc(db, "Modules", moduleId), { cameraApi });
            }

            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="settings-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <Header toggleSidebar={toggleSidebar} />

                <div className="content">
                    <h2>Settings</h2>

                    {/* 📌 Organization Details */}
                    <div className="settings-section">
                        <h3>Organization Information</h3>
                        <p><strong>Name:</strong> {organization.name}</p>
                        <p><strong>Subscription Plan:</strong> {organization.subscription}</p>
                        <p><strong>Renewal Date:</strong> {organization.renewalDate}</p>
                    </div>

                    {/* 📌 Camera Settings */}
                    <div className="settings-section">
                        <h3>Camera Settings</h3>
                        <label>Select Camera Source:</label>
                        <select value={organization.cameraMode} onChange={handleCameraChange}>
                            <option value="local">Local Webcam</option>
                            <option value="cctv">CCTV API</option>
                        </select>

                        {organization.cameraMode === "cctv" && (
                            <div className="cctv-input">
                                <label>Enter CCTV API URL:</label>
                                <input
                                    type="text"
                                    placeholder="https://your-cctv-api.com/stream"
                                    value={organization.cctvApiUrl}
                                    onChange={(e) =>
                                        setOrganization(prev => ({ ...prev, cctvApiUrl: e.target.value }))
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* 📌 Assign Camera API to Modules */}
                    <div className="settings-section">
                        <h3>Assign Camera API to Modules</h3>
                        <table className="module-camera-table">
                            <thead>
                            <tr>
                                <th>Module</th>
                                <th>Assigned Camera API</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modules.map(module => (
                                <tr key={module.id}>
                                    <td>{module.name}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={moduleCameraAssignments[module.id]}
                                            onChange={(e) =>
                                                handleModuleCameraChange(module.id, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 📌 Save Settings Button */}
                    <button className="save-button" onClick={saveSettings} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* 📌 Settings Footer */}
            <footer className="settings-footer">
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

export default Settings;
