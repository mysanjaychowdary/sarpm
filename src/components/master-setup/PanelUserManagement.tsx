"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button"; // Import Button

export function PanelUserManagement() {
  const { panels, panelUsers } = useAppContext();

  const getPanelName = (panelId: string) => {
    return panels.find((p) => p.id === panelId)?.name || "Unknown Panel";
  };

  const panelsForUsers = panels.filter(p => p.name !== "Panel 3"); // Only Panel 1 and Panel 2 have users

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Existing Panel Users</CardTitle>
        </CardHeader>
        <CardContent>
          {panelsForUsers.length === 0 ? (
            <p className="text-center text-muted-foreground">No panels available for user management.</p>
          ) : (
            <Tabs defaultValue={panelsForUsers[0].id} className="space-y-4">
              <TabsList>
                {panelsForUsers.map((panel) => (
                  <TabsTrigger key={panel.id} value={panel.id}>
                    {panel.name} Users
                  </TabsTrigger>
                ))}
              </TabsList>
              {panelsForUsers.map((panel) => (
                <TabsContent key={panel.id} value={panel.id}>
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
                                {/* Add Update/Delete actions here */}
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
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}