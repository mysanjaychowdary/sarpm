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
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen rounded-lg shadow-inner"> {/* Added bg-gray-50, rounded-lg, shadow-inner */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Campaign Dashboard</h1> {/* Larger, bolder title */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white shadow-lg"> {/* Orange button */}
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
        <Card className="shadow-lg border-l-4 border-primary-orange"> {/* Card with orange border and shadow */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">Today's Pending Reports</CardTitle>
            <span className="text-3xl font-bold text-primary-orange">{todayPendingReports.length}</span> {/* Orange count */}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reports created today that are still pending.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-green-500"> {/* Card with green border and shadow */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">Today's Completed Reports</CardTitle>
            <span className="text-3xl font-bold text-green-600">{todayCompletedReports.length}</span> {/* Green count */}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reports created today that have been completed.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-blue-500"> {/* Card with blue border and shadow */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">Total Campaigns</CardTitle>
            <span className="text-3xl font-bold text-blue-600">{campaignReports.length}</span> {/* Blue count */}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All campaign reports in the system.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Today's Pending Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={todayPendingReports} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Today's Completed Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={todayCompletedReports} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Recently Added Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable reports={recentlyAddedReports} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;