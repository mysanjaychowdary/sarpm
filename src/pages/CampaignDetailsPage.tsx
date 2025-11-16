"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, EyeOff, Copy, ArrowLeft } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CampaignDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaignReports, panels, panelUsers, panel3Credentials, updateCampaignStatus } = useAppContext();
  const [showPanel3Password, setShowPanel3Password] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] = useState(false);
  const [statusUpdateRemarks, setStatusUpdateRemarks] = useState("");

  const report = campaignReports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Report Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The campaign report with ID "{id}" could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const panel = panels.find((p) => p.id === report.panelId);
  const panelUser = panelUsers.find((u) => u.id === report.panelUserId);
  const panel3Credential = report.panel3CredentialId
    ? panel3Credentials.find((c) => c.id === report.panel3CredentialId)
    : undefined;

  const handleStatusUpdate = (newStatus: "Pending" | "Completed") => {
    updateCampaignStatus(report.id, newStatus);
    showSuccess(`Campaign status updated to ${newStatus}!`);
    setIsStatusUpdateDialogOpen(false);
    setStatusUpdateRemarks(""); // Clear remarks after update
    // In a real app, you'd also save remarks and audit log here.
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Password copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-3xl font-bold">Campaign Details: {report.campaignName}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign ID</p>
            <p className="text-lg font-semibold">{report.campaignId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign Name</p>
            <p className="text-lg font-semibold">{report.campaignName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign Type</p>
            <Badge variant={report.campaignType === "Urgent" ? "destructive" : report.campaignType === "Priority" ? "default" : "secondary"}>
              {report.campaignType}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
              {report.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Panel</p>
            <p>{panel?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Panel User</p>
            <p>{panelUser?.username} ({panelUser?.email})</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created Date</p>
            <p>{format(new Date(report.createdDate), "PPP p")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Updated Date</p>
            <p>{format(new Date(report.updatedDate), "PPP p")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created By (Admin ID)</p>
            <p>{report.createdByAdminId}</p>
          </div>
        </CardContent>
      </Card>

      {panel3Credential && (
        <Card>
          <CardHeader>
            <CardTitle>Panel 3 Credentials</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Panel 3 User Email</p>
              <p>{panel3Credential.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Panel 3 API Password</p>
              <div className="flex items-center space-x-2">
                <span>
                  {showPanel3Password
                    ? report.panel3PasswordPlaceholder
                    : "********"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPanel3Password(!showPanel3Password)}
                  className="h-8 w-8 p-0"
                >
                  {showPanel3Password ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {showPanel3Password && report.panel3PasswordPlaceholder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(report.panel3PasswordPlaceholder!)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Dialog open={isStatusUpdateDialogOpen} onOpenChange={setIsStatusUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Update Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Campaign Status</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="current-status" className="text-right">
                    Current Status
                  </Label>
                  <Badge
                    id="current-status"
                    className="col-span-3 w-fit"
                    variant={report.status === "Completed" ? "default" : "secondary"}
                  >
                    {report.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-right">
                    Remarks (Optional)
                  </Label>
                  <Textarea
                    id="remarks"
                    value={statusUpdateRemarks}
                    onChange={(e) => setStatusUpdateRemarks(e.target.value)}
                    className="col-span-3"
                    placeholder="Add any notes about the status update..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleStatusUpdate(report.status === "Pending" ? "Completed" : "Pending")
                  }
                >
                  Change to {report.status === "Pending" ? "Completed" : "Pending"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="destructive">Delete Campaign</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetailsPage;