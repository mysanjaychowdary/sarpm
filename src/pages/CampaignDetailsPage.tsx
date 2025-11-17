"use client";

import React, { useState, useMemo } from "react";
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
import { useSession } from "@/context/SessionContext"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

const CampaignDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaignReports, panels, panelUsers, panel3Credentials, updateCampaignStatus, isLoading, error, teamMembers, smsApiCredentials } = useAppContext();
  const { user, session } = useSession(); // Get session info
  const [showPanel3Password, setShowPanel3Password] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] = useState(false);
  const [statusUpdateRemarks, setStatusUpdateRemarks] = useState("");

  // Determine if the current user is an admin
  const currentUserTeamMember = useMemo(() => {
    return teamMembers.find(member => member.id === user?.id);
  }, [teamMembers, user]);
  const isAdmin = currentUserTeamMember?.role === "Admin";

  const report = campaignReports.find((r) => r.id === id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Campaign Details...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while the campaign details are being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An error occurred: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const panel = panels.find((p) => p.id === report.panel_id);
  const panelUser = panelUsers.find((u) => u.id === report.panel_user_id);
  const panel3Credential = report.panel3_credential_id
    ? panel3Credentials.find((c) => c.id === report.panel3_credential_id)
    : undefined;

  const handleStatusUpdate = async (newStatus: "Pending" | "Completed") => {
    try {
      await updateCampaignStatus(report.id, newStatus);
      showSuccess(`Campaign status updated to ${newStatus}!`);
      setIsStatusUpdateDialogOpen(false);
      setStatusUpdateRemarks(""); // Clear remarks after update
      // In a real app, you'd also save remarks and audit log here.

      // --- SMS Notification Logic ---
      if (smsApiCredentials.length > 0 && session) {
        const panelUserName = panelUser?.username || "a user";
        const smsMessage = `Campaign "${report.campaign_name}" (${report.campaign_id}) status updated to "${newStatus}" for ${panelUserName}. Remarks: ${statusUpdateRemarks || 'N/A'}`;
        
        const firstSmsCredential = smsApiCredentials[0]; // Use the first available credential
        const recipientPhoneNumber = firstSmsCredential.mobile_number;

        if (!recipientPhoneNumber) {
          console.warn("No recipient mobile number configured for SMS notifications. Skipping SMS.");
          showError("No recipient mobile number configured for SMS notifications.");
        } else {
          try {
            const { data, error: smsError } = await supabase.functions.invoke('send-sms', {
              body: JSON.stringify({
                phoneNumber: recipientPhoneNumber,
                message: smsMessage,
              }),
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (smsError) {
              console.error('SMS Edge Function error:', smsError.message);
              showError('Failed to send SMS: ' + smsError.message);
            } else if (data && data.message) {
              showSuccess("SMS notification sent: " + data.message);
            } else {
              showError("An unexpected error occurred during SMS notification.");
            }
          } catch (invokeError: any) {
            console.error("Unexpected error invoking send-sms function:", invokeError);
            showError("An unexpected error occurred while sending SMS: " + invokeError.message);
          }
        }
      } else if (smsApiCredentials.length === 0) {
        console.warn("No SMS API credentials configured. Skipping SMS notification.");
      } else if (!session) {
        console.warn("User session not available. Skipping SMS notification.");
      }
      // --- End SMS Notification Logic ---

    } catch (error) {
      // Error handled by AppContext
    }
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
      <h1 className="text-3xl font-bold">Campaign Details: {report.campaign_name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign ID</p>
            <p className="text-lg font-semibold">{report.campaign_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign Name</p>
            <p className="text-lg font-semibold">{report.campaign_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign Type</p>
            <Badge variant={report.campaign_type === "Urgent" ? "destructive" : report.campaign_type === "Priority" ? "default" : "secondary"}>
              {report.campaign_type}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campaign Date</p>
            <p>{format(new Date(report.campaign_date), "PPP")}</p>
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
            <p>{format(new Date(report.created_date), "PPP p")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Updated Date</p>
            <p>{format(new Date(report.updated_date), "PPP p")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created By (Admin ID)</p>
            <p>{report.created_by_admin_id}</p>
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
                    ? report.panel3_password_placeholder
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
                {showPanel3Password && report.panel3_password_placeholder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(report.panel3_password_placeholder!)}
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

      {user && ( // Only show actions if authenticated
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
            {isAdmin && ( // Only show delete button if user is an Admin
              <Button variant="destructive">Delete Campaign</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignDetailsPage;