import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ element: Component }) => {
    const auth = getAuth();
    const isAuthenticated = auth.currentUser !== null; // Check if the user is logged in

    return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
