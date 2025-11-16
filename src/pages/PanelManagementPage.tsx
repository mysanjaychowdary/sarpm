"use client";

import React from "react";
import { PanelManagement } from "@/components/master-setup/PanelManagement";

const PanelManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel Management</h1>
      <PanelManagement />
    </div>
  );
};

export default PanelManagementPage;