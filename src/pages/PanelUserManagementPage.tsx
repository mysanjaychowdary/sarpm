"use client";

import React, { useState } from "react";
import { PanelUserManagement } from "@/components/master-setup/PanelUserManagement";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { PanelUserForm } from "@/components/master-setup/PanelUserForm"; // New component for the form

const PanelUserManagementPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Panel User</DialogTitle>
            </DialogHeader>
            <PanelUserForm onUserAdded={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <PanelUserManagement />
    </div>
  );
};

export default PanelUserManagementPage;