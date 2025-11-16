"use client";

import React from "react";
import { EmployeeManagement } from "@/components/master-setup/EmployeeManagement";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext"; // Import useSession
import { Navigate } from "react-router-dom";

const EmployeeManagementPage = () => {
  const { isLoading, error } = useAppContext();
  const { isAdmin, isLoadingSession } = useSession(); // Get user role

  if (isLoadingSession) {
    return null; // Or a loading spinner
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />; // Redirect if not admin
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading Employees...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while employee data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An error occurred: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <EmployeeManagement />
    </div>
  );
};

export default EmployeeManagementPage;