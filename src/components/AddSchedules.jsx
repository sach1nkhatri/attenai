import React, { useState } from "react";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const AddSchedules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar
    };

    return (
        <div>
            <Header toggleSidebar={toggleSidebar} />
            <div className="dashboard-main-body" style={{ marginTop: "100px" }}> {/* Offset for fixed header */}
                {isSidebarOpen && <DashboardSidebar showDetails={false} />} {/* Sidebar without details */}
                <main className="dashboard-content">
                    <h1>Add Schedules</h1>
                    <p>Use this page to add new schedules.</p>
                </main>
            </div>
        </div>
    );
};

export default AddSchedules;
