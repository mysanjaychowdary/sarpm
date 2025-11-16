"use client";

import React from "react";
import { PanelManagement } from "@/components/master-setup/PanelManagement";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PanelManagementPage = () => {
  const { isLoading, error } = useAppContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Panel Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading Panels...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while panel data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Panel Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Panels</CardTitle>
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
      <h1 className="text-3xl font-bold">Panel Management</h1>
      <PanelManagement />
    </div>
  );
};

export default PanelManagementPage;