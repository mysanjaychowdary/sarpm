"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { showSuccess } from "@/utils/toast";
import { Link } from "react-router-dom";
import { CampaignReport } from "@/types";

interface CampaignTableProps {
  reports?: CampaignReport[]; // Optional prop to filter reports
}

export function CampaignTable({ reports }: CampaignTableProps) {
  const { campaignReports, panels, panelUsers, panel3Credentials, updateCampaignStatus } = useAppContext();

  const reportsToDisplay = reports || campaignReports; // Use filtered reports if provided, otherwise all

  const getPanelName = (panelId: string) => panels.find(p => p.id === panelId)?.name || "N/A";
  const getPanelUserName = (userId: string) => panelUsers.find(u => u.id === userId)?.username || "N/A";
  const getPanel3UserEmail = (credId?: string) => credId ? (panel3Credentials.find(c => c.id === credId)?.email || "N/A") : "N/A";

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending"; // Simple toggle for now
    updateCampaignStatus(id, newStatus);
    showSuccess(`Campaign status updated to ${newStatus}!`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign ID</TableHead>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Panel</TableHead>
            <TableHead>Panel User</TableHead>
            <TableHead>Panel 3 User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Updated Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportsToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">No campaign reports yet.</TableCell>
            </TableRow>
          ) : (
            reportsToDisplay.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.campaignId}</TableCell>
                <TableCell>{report.campaignName}</TableCell>
                <TableCell>
                  <Badge variant={report.campaignType === "Urgent" ? "destructive" : report.campaignType === "Priority" ? "default" : "secondary"}>
                    {report.campaignType}
                  </Badge>
                </TableCell>
                <TableCell>{getPanelName(report.panelId)}</TableCell>
                <TableCell>{getPanelUserName(report.panelUserId)}</TableCell>
                <TableCell>{getPanel3UserEmail(report.panel3CredentialId)}</TableCell>
                <TableCell>
                  <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(report.createdDate), "PPP p")}</TableCell>
                <TableCell>{format(new Date(report.updatedDate), "PPP p")}</TableCell>
                <TableCell className="flex space-x-2">
                  <Link to={`/campaigns/${report.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusUpdate(report.id, report.status)}
                  >
                    {report.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                  </Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}