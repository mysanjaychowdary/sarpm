"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, Eye, EyeOff, Copy } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { SmsApiCredential } from "@/types";
import { SmsApiCredentialForm } from "./SmsApiCredentialForm";
import { EditSmsApiCredentialForm } from "./EditSmsApiCredentialForm";

export function SmsApiCredentialManagement() {
  const { smsApiCredentials, deleteSmsApiCredential, isLoading, error } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<SmsApiCredential | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const handleEditClick = (credential: SmsApiCredential) => {
    setSelectedCredential(credential);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (credential: SmsApiCredential) => {
    setSelectedCredential(credential);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCredential) {
      try {
        await deleteSmsApiCredential(selectedCredential.id);
        showSuccess(`SMS API credential for instance ID '${selectedCredential.instance_id}' deleted successfully!`);
        setIsDeleteDialogOpen(false);
        setSelectedCredential(null);
      } catch (error) {
        // Error handled by AppContext
      }
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Access Token copied to clipboard!");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading SMS API Credentials...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while data is being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading SMS API Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <p>An error occurred: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage SMS API Credentials</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New SMS API Credential</DialogTitle>
              </DialogHeader>
              <SmsApiCredentialForm onCredentialAdded={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instance ID</TableHead>
                <TableHead>Access Token</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smsApiCredentials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No SMS API credentials yet.</TableCell>
                </TableRow>
              ) : (
                smsApiCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">{credential.instance_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>
                          {showPasswords[credential.id]
                            ? credential.access_token
                            : "********"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="h-8 w-8 p-0"
                        >
                          {showPasswords[credential.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        {showPasswords[credential.id] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(credential.access_token)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(credential)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(credential)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCredential && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit SMS API Credential</DialogTitle>
            </DialogHeader>
            <EditSmsApiCredentialForm
              credential={selectedCredential}
              onCredentialUpdated={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedCredential && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to delete the SMS API credential for instance ID "<strong>{selectedCredential.instance_id}</strong>"?
              This action cannot be undone.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}