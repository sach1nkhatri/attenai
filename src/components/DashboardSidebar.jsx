import React from "react";
import "../css/DashboardSidebar.css"; // Import the sidebar CSS file if needed

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
                <button>Add Schedule</button>
                <button>Settings</button>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
