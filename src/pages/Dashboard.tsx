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
import { useSession } from "@/context/SessionContext"; // Import useSession

const Dashboard = () => {
  const { campaignReports, isLoading, error, teamMembers } = useAppContext();
  const { user } = useSession(); // Get current user
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log("Dashboard: Rendering. isLoading:", isLoading, "error:", error, "campaignReports count:", campaignReports.length);

  // Filter campaigns based on user role
  const userCampaignReports = useMemo(() => {
    if (!user) return []; // No user, no reports
    const currentUserTeamMember = teamMembers.find(member => member.id === user.id);

    if (currentUserTeamMember?.role === "Admin") {
      return campaignReports; // Admins see all
    } else {
      // Team Members only see campaigns they created
      return campaignReports.filter(report => report.created_by_admin_id === user.id);
    }
  }, [campaignReports, user, teamMembers]);

  const todayReports = useMemo(() => {
    return userCampaignReports.filter(report => isToday(new Date(report.created_date)));
  }, [userCampaignReports]);

  const todayPendingReports = todayReports.filter(report => report.status === "Pending");
  const todayCompletedReports = todayReports.filter(report => report.status === "Completed");
  const recentlyAddedReports = userCampaignReports.slice(0, 5); // Slice from filtered reports

  if (isLoading) {
    console.log("Dashboard: Showing loading state.");
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Dashboard...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while dashboard data is being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.log("Dashboard: Showing error state.");
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>An error occurred: {error}</p>
        </CardContent>
      </Card>
    );
  }

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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <span className="text-2xl font-bold">{userCampaignReports.length}</span>
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