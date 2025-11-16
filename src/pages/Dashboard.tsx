"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignEntryForm } from "@/components/campaigns/CampaignEntryForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { isToday } from "date-fns";

const Dashboard = () => {
  const { campaignReports } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const todayReports = useMemo(() => {
    return campaignReports.filter(report => isToday(new Date(report.createdDate)));
  }, [campaignReports]);

  const todayPendingReports = todayReports.filter(report => report.status === "Pending");
  const todayCompletedReports = todayReports.filter(report => report.status === "Completed");
  const recentlyAddedReports = campaignReports.slice(0, 5); // Show top 5 most recent overall

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Pending Reports</CardTitle>
            <span className="text-2xl font-bold">{todayPendingReports.length}</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Reports created today that are still pending.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Completed Reports</CardTitle>
            <span className="text-2xl font-bold">{todayCompletedReports.length}</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Reports created today that have been completed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <span className="text-2xl font-bold">{campaignReports.length}</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All campaign reports in the system.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Pending Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={todayPendingReports} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Completed Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={todayCompletedReports} />
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