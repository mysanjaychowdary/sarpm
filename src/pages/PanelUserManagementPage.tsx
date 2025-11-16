"use client";

import React from "react";
import { PanelUserManagement } from "@/components/master-setup/PanelUserManagement";

const PanelUserManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel User Management</h1>
      <PanelUserManagement />
    </div>
  );
};

export default PanelUserManagementPage;