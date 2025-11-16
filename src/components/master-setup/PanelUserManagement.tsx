"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Eye, EyeOff, Copy } from "lucide-react";
import { PanelUserForm } from "./PanelUserForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccess } from "@/utils/toast";
import { Panel3Credential } from "@/types";

const panel3CredentialFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  apiPasswordPlaceholder: z.string().min(6, { message: "API password must be at least 6 characters." }),
});

export function PanelUserManagement() {
  const { panels, panelUsers, panel3Credentials, addPanel3Credential } = useAppContext();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddPanel3CredentialDialogOpen, setIsAddPanel3CredentialDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const panel3Form = useForm<z.infer<typeof panel3CredentialFormSchema>>({
    resolver: zodResolver(panel3CredentialFormSchema),
    defaultValues: {
      email: "",
      apiPasswordPlaceholder: "",
    },
  });

  function onPanel3CredentialSubmit(values: z.infer<typeof panel3CredentialFormSchema>) {
    addPanel3Credential(values as Omit<Panel3Credential, "id">);
    showSuccess("Panel 3 credential added successfully!");
    panel3Form.reset();
    setIsAddPanel3CredentialDialogOpen(false);
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Password copied to clipboard!");
  };

  const getPanelName = (panelId: string) => {
    return panels.find((p) => p.id === panelId)?.name || "Unknown Panel";
  };

  const panelsForUsers = panels.filter(p => p.name !== "Panel 3"); // Only Panel 1 and Panel 2 have users

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel User & Credential Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={panelsForUsers[0]?.id || "panel3-credentials"} className="space-y-4">
            <TabsList>
              {panelsForUsers.map((panel) => (
                <TabsTrigger key={panel.id} value={panel.id}>
                  {panel.name} Users
                </TabsTrigger>
              ))}
              <TabsTrigger value="panel3-credentials">Panel 3 Credentials</TabsTrigger>
            </TabsList>

            {panelsForUsers.map((panel) => (
              <TabsContent key={panel.id} value={panel.id}>
                <div className="flex justify-end mb-4">
                  <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Panel User</DialogTitle>
                      </DialogHeader>
                      <PanelUserForm onUserAdded={() => setIsAddUserDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {panelUsers.filter(user => user.panelId === panel.id).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No users for {panel.name} yet.</TableCell>
                      </TableRow>
                    ) : (
                      panelUsers
                        .filter((user) => user.panelId === panel.id)
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}

            <TabsContent value="panel3-credentials">
              <div className="flex justify-end mb-4">
                <Dialog open={isAddPanel3CredentialDialogOpen} onOpenChange={setIsAddPanel3CredentialDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Panel 3 Credential
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Panel 3 Credential</DialogTitle>
                    </DialogHeader>
                    <Form {...panel3Form}>
                      <form onSubmit={panel3Form.handleSubmit(onPanel3CredentialSubmit)} className="space-y-4">
                        <FormField
                          control={panel3Form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email / Login ID</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="e.g., p3user@panel3.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={panel3Form.control}
                          name="apiPasswordPlaceholder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Password / Access Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter API password" {...field} />
                              </FormControl>
                              <FormDescription>
                                (In a real app, this would be encrypted)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add Credential</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email / Login ID</TableHead>
                    <TableHead>API Password</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panel3Credentials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No Panel 3 credentials yet.</TableCell>
                    </TableRow>
                  ) : (
                    panel3Credentials.map((credential) => (
                      <TableRow key={credential.id}>
                        <TableCell className="font-medium">{credential.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>
                              {showPasswords[credential.id]
                                ? credential.apiPasswordPlaceholder
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
                                onClick={() => copyToClipboard(credential.apiPasswordPlaceholder)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Update</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}