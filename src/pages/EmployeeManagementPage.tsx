"use client";

import React from "react";
import { EmployeeManagement } from "@/components/master-setup/EmployeeManagement";

const EmployeeManagementPage = () => {
  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen rounded-lg shadow-inner"> {/* Added bg-gray-50, rounded-lg, shadow-inner */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Employee Management</h1> {/* Larger, bolder title */}
      <EmployeeManagement />
    </div>
  );
};

export default EmployeeManagementPage;