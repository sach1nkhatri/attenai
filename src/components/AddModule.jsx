import React, { useState } from 'react';
import '../css/AddModule.css';

const AddModule = ({ onAddSchedule }) => {
    const [module, setModule] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [workingDays, setWorkingDays] = useState('');

    const handleAddModule = () => {
        if (module && startTime && endTime && workingDays) {
            onAddSchedule({
                module,
                startTime,
                endTime,
                workingDays,
            });
            setModule('');
            setStartTime('');
            setEndTime('');
            setWorkingDays('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h1 className="title">Add Schedules</h1>
            <div className="input-group" style={{ marginBottom: '5px' }}>
                <label className="input-label">Module</label>
                <input
                    type="text"
                    className="input-field"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                />
            </div>
            <div className="input-group" style={{ marginBottom: '5px' }}>
                <label className="input-label">Start Time</label>
                <input
                    type="time"
                    className="input-field"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div className="input-group" style={{ marginBottom: '5px' }}>
                <label className="input-label">End Time</label>
                <input
                    type="time"
                    className="input-field"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <div className="input-group" style={{ marginBottom: '5px', position: 'relative' }}>
                <label className="input-label">Working Days</label>
                <input
                    type="date"
                    className="input-field date-input"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                />
            </div>
            <button className="add-btn" onClick={handleAddModule}>
                Add Module
            </button>
        </div>
    );
};

export default AddModule;
