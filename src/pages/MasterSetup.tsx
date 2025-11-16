"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelManagement } from "@/components/master-setup/PanelManagement";
import { PanelUserManagement } from "@/components/master-setup/PanelUserManagement";
import { Panel3CredentialManagement } from "@/components/master-setup/Panel3CredentialManagement";

const MasterSetup = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Master Setup</h1>
      <Tabs defaultValue="panels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="panels">Panel Management</TabsTrigger>
          <TabsTrigger value="panel-users">Panel User Management</TabsTrigger>
          <TabsTrigger value="panel3-credentials">Panel 3 Credentials</TabsTrigger>
        </TabsList>
        <TabsContent value="panels">
          <PanelManagement />
        </TabsContent>
        <TabsContent value="panel-users">
          <PanelUserManagement />
        </TabsContent>
        <TabsContent value="panel3-credentials">
          <Panel3CredentialManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterSetup;