"use client";

import React from "react";
import { PanelManagement } from "@/components/master-setup/PanelManagement";

const PanelManagementPage = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Panel Management</h1>
      <PanelManagement />
    </div>
  );
};

export default PanelManagementPage;