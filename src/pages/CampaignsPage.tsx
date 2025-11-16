"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CampaignEntryForm } from "@/components/campaigns/CampaignEntryForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { PlusCircle } from "lucide-react";

const CampaignsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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

      <Card>
        <CardHeader>
          <CardTitle>All Campaign Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsPage;