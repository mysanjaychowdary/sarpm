"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignEntryForm } from "@/components/campaigns/CampaignEntryForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { campaignReports } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingReports = campaignReports.filter(report => report.status === "Pending");
  const recentlyAddedReports = campaignReports.slice(0, 5); // Show top 5 most recent

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign Report</DialogTitle>
            </DialogHeader>
            <CampaignEntryForm onCampaignAdded={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={pendingReports} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={recentlyAddedReports} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;