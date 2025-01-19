import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from '../components/clientHeader';
import Footer from '../components/Footer';
import DashboardSidebar from '../components/DashboardSidebar';
import AddModule from './AddModule';
import '../css/AddSchedules.css';

const AddSchedules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const addSchedule = (newSchedule) => {
        setSchedules([...schedules, newSchedule]);
    };

    const handleCardClick = (schedule) => {
        navigate('/moduleinfo', { state: { schedule } }); // Navigate to ModuleInfo and pass data
    };

    return (
        <div className="add-schedules-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="dashboard-main-body">
                {isSidebarOpen && <DashboardSidebar showDetails={false} />}
                <div className="main-content">
                    <AddModule onAddSchedule={addSchedule} />
                    <div className="modules-container">
                        <h2 className="modules-heading">Modules</h2>
                        <div className="schedule-cards-horizontal">
                            {schedules.map((schedule, index) => (
                                <div
                                    className="card-horizontal"
                                    key={index}
                                    onClick={() => handleCardClick(schedule)} // Handle card click
                                    style={{ cursor: 'pointer' }} // Make cards look clickable
                                >
                                    <p><strong>Module:</strong> {schedule.module}</p>
                                    <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                                    <p><strong>Working Days:</strong> {schedule.workingDays}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddSchedules;
