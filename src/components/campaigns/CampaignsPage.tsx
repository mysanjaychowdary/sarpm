"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CampaignEntryForm } from "@/components/campaigns/CampaignEntryForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { CampaignType } from "@/types";

const CampaignsPage = () => {
  const { campaignReports, panels, isLoading, error } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPanel, setFilterPanel] = useState("all");
  const [filterCampaignType, setFilterCampaignType] = useState("all");

  const filteredCampaigns = useMemo(() => {
    let filtered = campaignReports.filter(report => {
      const matchesStatus = activeTab === "pending" ? report.status === "Pending" : report.status === "Completed";
      const matchesSearch = report.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.campaign_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPanel = filterPanel === "all" || report.panel_id === filterPanel;
      const matchesCampaignType = filterCampaignType === "all" || report.campaign_type === filterCampaignType;
      return matchesStatus && matchesSearch && matchesPanel && matchesCampaignType;
    });
    return filtered;
  }, [campaignReports, activeTab, searchTerm, filterPanel, filterCampaignType]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Campaigns...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while campaign data is being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Campaigns</CardTitle>
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
        <h1 className="text-3xl font-bold">Campaigns</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Filter Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-full md:col-span-1"
          />
          <Select value={filterPanel} onValueChange={setFilterPanel}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Panel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Panels</SelectItem>
              {panels.filter(p => p.name !== "Panel 3").map(panel => (
                <SelectItem key={panel.id} value={panel.id}>{panel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCampaignType} onValueChange={setFilterCampaignType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Priority">Priority</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "completed")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Reports</TabsTrigger>
          <TabsTrigger value="completed">Completed Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Campaign Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignTable reports={filteredCampaigns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Campaign Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignTable reports={filteredCampaigns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;