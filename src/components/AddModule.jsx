import React, { useState } from 'react';
import '../css/AddModule.css';

const AddModule = ({ onAddSchedule }) => {
    const [module, setModule] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [workingDays, setWorkingDays] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayChange = (day) => {
        setWorkingDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleAddModule = () => {
        if (module && startTime && endTime && workingDays.length > 0) {
            onAddSchedule({
                module,
                startTime,
                endTime,
                workingDays,
            });
            setModule('');
            setStartTime('');
            setEndTime('');
            setWorkingDays([]);
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
                <div
                    className="dropdown-menu"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                    {workingDays.length > 0 ? workingDays.join(', ') : 'Select Days'}
                    <span className="dropdown-arrow">&#9660;</span>
                </div>
                {isDropdownOpen && (
                    <div className="popup">
                        {daysOfWeek.map((day) => (
                            <label key={day} className="day-checkbox">
                                <input
                                    type="checkbox"
                                    checked={workingDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <button className="add-btn" onClick={handleAddModule}>
                Add Module
            </button>
        </div>
    );
};

export default AddModule;
