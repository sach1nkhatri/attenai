import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenai from './components/BlogAttenAi';
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule component
import ModuleInfo from './components/Moduleinfo';
import RegisterUser from './components/RegisterUser';
import Attendance from './components/Attendance';
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlogAttenai />} /> {/* Default route to BlogAttenai */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                <Route path="/add-schedule" element={<AddSchedule/>} /> {/* Add Schedule route */}
                <Route path="/moduleinfo" element={<ModuleInfo />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route path="/Attendance" element={<Attendance />} />
            </Routes>
        </Router>
    );
};

export default App;
