"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // e.g., ['Admin', 'Employee']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, employee, isLoadingSession } = useSession();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading application...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && employee && !allowedRoles.includes(employee.role)) {
    // If user is logged in but doesn't have the required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;