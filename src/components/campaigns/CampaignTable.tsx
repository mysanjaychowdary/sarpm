"use client";

import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { Link } from "react-router-dom";
import { CampaignReport } from "@/types";
import { useSession } from "@/context/SessionContext"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

interface CampaignTableProps {
  reports?: CampaignReport[]; // Optional prop to filter reports
}

export function CampaignTable({ reports }: CampaignTableProps) {
  const { campaignReports, panels, panelUsers, panel3Credentials, updateCampaignStatus, teamMembers, smsApiCredentials } = useAppContext();
  const { user, session } = useSession(); // Get session info

  // Determine if the current user is an admin
  const currentUserTeamMember = useMemo(() => {
    return teamMembers.find(member => member.id === user?.id);
  }, [teamMembers, user]);
  const isAdmin = currentUserTeamMember?.role === "Admin";

  const reportsToDisplay = reports || campaignReports; // Use filtered reports if provided, otherwise all

  const getPanelName = (panelId: string) => panels.find(p => p.id === panelId)?.name || "N/A";
  const getPanelUserName = (userId: string) => panelUsers.find(u => u.id === userId)?.username || "N/A";
  const getPanel3UserEmail = (credId?: string) => credId ? (panel3Credentials.find(c => c.id === credId)?.email || "N/A") : "N/A";

  const handleStatusUpdate = async (report: CampaignReport, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending"; // Simple toggle for now
    try {
      await updateCampaignStatus(report.id, newStatus);
      showSuccess(`Campaign status updated to ${newStatus}!`);

      // --- SMS Notification Logic ---
      if (smsApiCredentials.length > 0 && session) {
        const panelUserName = getPanelUserName(report.panel_user_id);
        const smsMessage = `Campaign "${report.campaign_name}" (${report.campaign_id}) status updated to "${newStatus}" for ${panelUserName}.`;
        
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign ID</TableHead>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Campaign Date</TableHead>
            <TableHead>Panel</TableHead>
            <TableHead>Panel User</TableHead>
            <TableHead>Panel 3 User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Updated Date</TableHead>
            <TableHead className="sticky right-0 bg-background z-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportsToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">No campaign reports yet.</TableCell>
            </TableRow>
          ) : (
            reportsToDisplay.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.campaign_id}</TableCell>
                <TableCell>{report.campaign_name}</TableCell>
                <TableCell>
                  <Badge variant={report.campaign_type === "Urgent" ? "destructive" : report.campaign_type === "Priority" ? "default" : "secondary"}>
                    {report.campaign_type}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(report.campaign_date), "PPP")}</TableCell>
                <TableCell>{getPanelName(report.panel_id)}</TableCell>
                <TableCell>{getPanelUserName(report.panel_user_id)}</TableCell>
                <TableCell>{getPanel3UserEmail(report.panel3_credential_id)}</TableCell>
                <TableCell>
                  <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(report.created_date), "PPP p")}</TableCell>
                <TableCell>{format(new Date(report.updated_date), "PPP p")}</TableCell>
                <TableCell className="sticky right-0 bg-background z-10 flex space-x-2">
                  <Link to={`/campaigns/${report.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  {user && ( // Show update status button for all authenticated users
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusUpdate(report, report.status)}
                    >
                      {report.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                    </Button>
                  )}
                  {isAdmin && ( // Only show delete button if user is an Admin
                    <Button variant="destructive" size="sm">Delete</Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}