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
  const { campaignReports, panels } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPanel, setFilterPanel] = useState("all");
  const [filterCampaignType, setFilterCampaignType] = useState("all");

  const filteredCampaigns = useMemo(() => {
    let filtered = campaignReports.filter(report => {
      const matchesStatus = activeTab === "pending" ? report.status === "Pending" : report.status === "Completed";
      const matchesSearch = report.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.campaignId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPanel = filterPanel === "all" || report.panelId === filterPanel;
      const matchesCampaignType = filterCampaignType === "all" || report.campaignType === filterCampaignType;
      return matchesStatus && matchesSearch && matchesPanel && matchesCampaignType;
    });
    return filtered;
  }, [campaignReports, activeTab, searchTerm, filterPanel, filterCampaignType]);

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen rounded-lg shadow-inner"> {/* Added bg-gray-50, rounded-lg, shadow-inner */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Campaigns</h1> {/* Larger, bolder title */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white shadow-lg"> {/* Orange button */}
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

      <Card className="shadow-lg"> {/* Added shadow-lg */}
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Filter Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-full md:col-span-1 shadow-sm" // Added shadow-sm
          />
          <Select value={filterPanel} onValueChange={setFilterPanel}>
            <SelectTrigger className="shadow-sm"> {/* Added shadow-sm */}
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
            <SelectTrigger className="shadow-sm"> {/* Added shadow-sm */}
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
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-lg"> {/* Styled TabsList */}
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white data-[state=active]:shadow-sm">Pending Reports</TabsTrigger> {/* Orange active tab */}
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white data-[state=active]:shadow-sm">Completed Reports</TabsTrigger> {/* Orange active tab */}
        </TabsList>
        <TabsContent value="pending">
          <Card className="shadow-lg"> {/* Added shadow-lg */}
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Pending Campaign Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignTable reports={filteredCampaigns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card className="shadow-lg"> {/* Added shadow-lg */}
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Completed Campaign Reports</CardTitle>
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