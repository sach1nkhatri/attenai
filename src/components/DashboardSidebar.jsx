// src/components/DashboardSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../css/DashboardSidebar.css";

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
            <nav className="dashboard-menu">
                <Link to="/Dashboard" onClick={toggleSidebar}>
                    <button>Dashboard</button>
                </Link>
                <Link to="/Attendance" onClick={toggleSidebar}>
                    <button>Attendance</button>
                </Link>
                <Link to="/register" onClick={toggleSidebar}>
                    <button>Register Users</button>
                </Link>
                <button>User Details</button>
                <Link to="/add-schedule" onClick={toggleSidebar}>
                    <button>Add Schedule</button>
                </Link>
                <Link to="/settings" onClick={toggleSidebar}>
                    <button>Settings</button>
                </Link>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
