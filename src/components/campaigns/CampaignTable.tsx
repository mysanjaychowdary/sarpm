"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { showSuccess } from "@/utils/toast";

export function CampaignTable() {
  const { campaignReports, panels, panelUsers, panel3Credentials, updateCampaignStatus } = useAppContext();

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
          {campaignReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">No campaign reports yet.</TableCell>
            </TableRow>
          ) : (
            campaignReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.campaignId}</TableCell>
                <TableCell>{report.campaignName}</TableCell>
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
                  <Button variant="outline" size="sm">View</Button>
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