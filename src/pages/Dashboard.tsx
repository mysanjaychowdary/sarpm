"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignEntryForm } from "@/components/campaigns/CampaignEntryForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign Report</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignEntryForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;