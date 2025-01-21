// src/components/Dashboard.jsx
import React from "react";
import Sidebar from "./DashboardSidebar";
import CameraFeed from "./CameraFeed";
import Header from "./clientHeader";
import "../css/Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content">
                    <CameraFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
