import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenai from './components/BlogAttenAi';
import "./App.css"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlogAttenai />} /> {/* Default route to BlogAttenai */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
            </Routes>
        </Router>
    );
};

export default App;
