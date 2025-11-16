"use client";

import React from "react";
import { PanelUserManagement } from "@/components/master-setup/PanelUserManagement";

const PanelUserManagementPage = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen rounded-lg shadow-inner"> {/* Added bg-gray-50, rounded-lg, shadow-inner */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Panel User Management</h1> {/* Larger, bolder title */}
      <PanelUserManagement />
    </div>
  );
};

export default PanelUserManagementPage;