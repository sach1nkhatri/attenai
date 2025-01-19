import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenAi from './components/BlogAttenAi';
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule component
import Attendance from './components/Attendance';
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlogAttenAi />} /> {/* Default route */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                <Route path="/add-schedule" element={<AddSchedule />} /> {/* Add Schedule route */}
                <Route path="/attendance" element={<Attendance/>} /> {/* Attendance Section route */}
            </Routes>
        </Router>
    );
};

export default App;
