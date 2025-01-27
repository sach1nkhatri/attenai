import React, { useState } from "react";
import Sidebar from "./DashboardSidebar";
import CameraFeed from "./CameraFeed";
import DashboardOverview from "./DashboardOverview";
import ClientHeader from "./clientHeader";
import Insights from "./Insights";
import RecentActivity from "../components/RecentActivity";
import "../css/Dashboard.css";

const Footer = () => (
    <footer className="footer">
        <p>
        &copy; 2025 AttenAi | Developed By{' '}
        <a
            href="https://sachin.bio/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Sachin Khatri
        </a>
    </p>
    </footer>
)

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Sample data (can be fetched from an API or database)
    const sampleData = {
        present: 42,
        absent: 8,
        averageArrival: "8:45 AM",
        onTimeRate: 94,
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const activities = [
        { name: "Sachin Khatri", time: "9:00 AM", status: "Checked In" },
        { name: "Rojit Dahal", time: "8:45 AM", status: "Checked In" },
        { name: "Praj Shrestha", time: "8:30 AM", status: "Checked In" },
        { name: "Mukti Thapa", time: "9:15 AM", status: "Late" },
    ];

    return (
        <div className="dashboard-grid">
                <ClientHeader toggleSidebar={toggleSidebar} />
                <DashboardOverview
                    present={sampleData.present}
                    absent={sampleData.absent}
                    averageArrival={sampleData.averageArrival}
                    onTimeRate={sampleData.onTimeRate}
                />

                <CameraFeed />
                <RecentActivity activities={activities} />
            <Insights />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
            </div>
        </div>
    );
};

export default Dashboard;
