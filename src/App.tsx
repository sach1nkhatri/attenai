import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenai from './components/BlogAttenAi';
<<<<<<< HEAD
import "./App.css"
=======
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule component
import ModuleInfo from './components/Moduleinfo';
import "./App.css";
>>>>>>> 234a18a16603b2d1890adfbaef0015a711a7ace9

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
