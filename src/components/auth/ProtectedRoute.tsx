"use client";

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtectedRouteProps {
  allowedRoles?: ("Admin" | "Campaign Manager")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, user, isLoadingSession, isAdmin, isCampaignManager } = useSession();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Checking authentication status.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role) {
    const hasPermission = allowedRoles.includes(user.role);
    if (!hasPermission) {
      // Redirect to dashboard or a permission denied page
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;