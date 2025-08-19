import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    // If a token exists, the user is logged in, so render the page they requested.
    // The <Outlet /> component is a placeholder for the actual page component.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
