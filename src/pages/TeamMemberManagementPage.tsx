"use client";

import React from "react";
import { TeamMemberManagement } from "@/components/team-members/TeamMemberManagement";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamMemberManagementPage = () => {
  const { isLoading, error } = useAppContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Team Member Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading Team Members...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while team member data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Team Member Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An error occurred: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Member Management</h1>
      <TeamMemberManagement />
    </div>
  );
};

export default TeamMemberManagementPage;