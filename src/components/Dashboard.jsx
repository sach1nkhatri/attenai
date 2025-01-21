import React, { useState } from "react";
import Sidebar from "./DashboardSidebar";
import CameraFeed from "./CameraFeed";
import ClientHeader from "./clientHeader";
import "../css/Dashboard.css";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <ClientHeader toggleSidebar={toggleSidebar} />
                <div className="content">
                    <CameraFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
