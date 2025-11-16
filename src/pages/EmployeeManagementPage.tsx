"use client";

import React from "react";
import { EmployeeManagement } from "@/components/master-setup/EmployeeManagement";

const EmployeeManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <EmployeeManagement />
    </div>
  );
};

export default EmployeeManagementPage;