import React from "react";
import { Link } from "react-router-dom";
import "../css/DashboardSidebar.css";

const DashboardSidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <nav className="dashboard-menu">
                <Link to="/Attendance">
                <button>Attendance</button>
                </Link>
                <Link to="/register">
                <button>Register Users</button>
                </Link>
                <button>User Details</button>
                <Link to="/add-schedule">
                    <button>Add Schedule</button>
                </Link>
                <button>Settings</button>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
