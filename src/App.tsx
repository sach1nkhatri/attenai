import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css"
import ModuleInfo from './components/Moduleinfo';
import BlogAttenAi from './components/BlogAttenAi';
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule comp
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlogAttenAi />} /> {/* Default route */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                <Route path="/addSchedule" element={<AddSchedule />} />
                <Route path="/ModuleInfo" element={<ModuleInfo />} />
            </Routes>
        </Router>
    );
};

export default App;
