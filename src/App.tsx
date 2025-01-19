import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenai from './components/BlogAttenAi';
import "./App.css"
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule component
import ModuleInfo from './components/Moduleinfo';
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
            </Routes>
        </Router>
    );
};

export default App;
