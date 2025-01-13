import React from "react";
import { Link } from "react-router-dom";
import "../css/DashboardSidebar.css";

const DashboardSidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <h2>Details</h2>
            <div className="dashboard-selected-person">Selected Person</div>
            <div className="dashboard-input-group">
                <label>Name</label>
                <input type="text" />
            </div>
            <div className="dashboard-input-group">
                <label>Age</label>
                <input type="text" />
            </div>
            <div className="dashboard-input-group">
                <label>Address</label>
                <input type="text" />
            </div>
            <div className="dashboard-input-group">
                <label>Class</label>
                <input type="text" />
            </div>
            <div className="dashboard-buttons">
                <button>Delete</button>
                <button>Update</button>
            </div>
            <nav className="dashboard-menu">
                <button>Attendance</button>
                <button>Unidentified Users</button>
                <button>Student Details</button>
                <Link to="/add-schedule">
                    <button>Add Schedule</button>
                </Link>
                <button>Settings</button>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
