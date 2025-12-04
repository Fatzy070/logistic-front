import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload)

    // Check expiration
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('token');  // optional: clear old token
      return <Navigate to="/login" replace />;
    }

    // Token exists and is still valid
    return <Outlet />;

  } catch (error) {
    // If token is corrupted or decoding fails
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
