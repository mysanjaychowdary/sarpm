"use client";

import React from "react";
import { Panel3CredentialManagement } from "@/components/master-setup/Panel3CredentialManagement";

const Panel3CredentialManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel 3 Credential Management</h1>
      <Panel3CredentialManagement />
    </div>
  );
};

export default Panel3CredentialManagementPage;