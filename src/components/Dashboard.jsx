import React, { useState } from "react";
import ClientHeader from "../components/clientHeader"; // Import ClientHeader
import DashboardSidebar from "../components/DashboardSidebar"; // Import Sidebar component
import CameraFeed from "../components/CameraFeed"; // Import CameraFeed
import "../css/Dashboard.css"; // Import dashboard styles

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar
    };

    return (
        <div>
            <ClientHeader toggleSidebar={toggleSidebar} />
            <div className="dashboard-main-body" style={{ marginTop: "100px" }}> {/* Offset for fixed header */}
                {isSidebarOpen && <DashboardSidebar />} {/* Conditionally render sidebar */}
                <section className="dashboard-content">
                    <h2>Dashboard</h2>
                    <div className="camera-feed">
                        <CameraFeed />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
