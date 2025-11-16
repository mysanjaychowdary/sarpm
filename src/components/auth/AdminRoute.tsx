"use client";

import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminRoute = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { teamMembers, isLoading: isAppContextLoading } = useAppContext();

  const isLoading = isSessionLoading || isAppContextLoading;

  const currentUserTeamMember = useMemo(() => {
    if (session?.user && teamMembers.length > 0) {
      return teamMembers.find(member => member.id === session.user.id);
    }
    return null;
  }, [session, teamMembers]);

  const isAdmin = currentUserTeamMember?.role === "Admin";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Checking user permissions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Redirect non-admin users to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;