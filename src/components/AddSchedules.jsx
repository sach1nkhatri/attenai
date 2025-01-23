import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/clientHeader';
import Footer from '../components/Footer';
import DashboardSidebar from '../components/DashboardSidebar';
import AddModule from './AddModule';
import '../css/AddSchedules.css';

const AddSchedules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Set initial state to false
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
    };

    const addSchedule = (newSchedule) => {
        setSchedules([...schedules, newSchedule]);
    };

    const handleCardClick = (schedule) => {
        navigate('/moduleinfo', { state: { schedule } });
    };

    return (
        <div className="add-schedules-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass props */}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}> {/* Apply class */}
                <Header toggleSidebar={toggleSidebar} />
                <div className="main-content-inner">
                    <AddModule onAddSchedule={addSchedule} />
                    <div className="modules-container">
                        <h2 className="modules-heading">Modules</h2>
                        <div className="schedule-cards-horizontal">
                            {schedules.map((schedule, index) => (
                                <div
                                    className="card-horizontal"
                                    key={index}
                                    onClick={() => handleCardClick(schedule)}
                                    style={{ cursor: 'pointer' }}
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
