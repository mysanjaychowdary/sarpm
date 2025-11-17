"use client";

import React from "react";
import { SmsApiCredentialManagement } from "@/components/master-setup/SmsApiCredentialManagement";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SmsApiSettingsPage = () => {
  const { isLoading, error } = useAppContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">SMS API Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading SMS API Credentials...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while SMS API credential data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">SMS API Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading SMS API Credentials</CardTitle>
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
      <h1 className="text-3xl font-bold">SMS API Settings</h1>
      <SmsApiCredentialManagement />
    </div>
  );
};

export default SmsApiSettingsPage;