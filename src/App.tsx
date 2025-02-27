import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogAttenai from './components/BlogAttenAi';
import AddSchedule from './components/AddSchedules'; // Import the AddSchedule component
import ModuleInfo from './components/Moduleinfo';
import RegisterUser from './components/RegisterUser';
import Attendance from './components/Attendance';
import Settings from './components/settings';
import BillingSection from './components/Billing';
import PrivateRoute from './components/ProvateRoute'; // Import the PrivateRoute
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlogAttenai />} /> {/* Default route to BlogAttenai */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/billing" element={<BillingSection />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} /> {/* Dashboard route */}
                <Route path="/add-schedule" element={<PrivateRoute element={<AddSchedule />} />} /> {/* Add Schedule route */}
                <Route path="/moduleinfo" element={<PrivateRoute element={<ModuleInfo />} />} />
                <Route path="/register" element={<PrivateRoute element={<RegisterUser />} />} />
                <Route path="/Attendance" element={<PrivateRoute element={<Attendance />} />} />
                <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
            </Routes>
        </Router>
    );
};

export default App;
