"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { Panel } from "@/types";
import { EditPanelForm } from "./EditPanelForm";

const panelFormSchema = z.object({
  name: z.string().min(2, { message: "Panel name must be at least 2 characters." }),
  description: z.string().optional(),
  requires_panel3_credentials: z.boolean().default(false),
});

export function PanelManagement() {
  const { panels, addPanel, deletePanel, isLoading, error } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);

  const form = useForm<z.infer<typeof panelFormSchema>>({
    resolver: zodResolver(panelFormSchema),
    defaultValues: {
      name: "",
      description: "",
      requires_panel3_credentials: false,
    },
  });

  async function onSubmit(values: z.infer<typeof panelFormSchema>) {
    try {
      await addPanel(values as Omit<Panel, "id">);
      showSuccess("Panel added successfully!");
      form.reset();
    } catch (error) {
      // Error handled by AppContext
    }
  }

  const handleEditClick = (panel: Panel) => {
    setSelectedPanel(panel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (panel: Panel) => {
    setSelectedPanel(panel);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPanel) {
      try {
        await deletePanel(selectedPanel.id);
        showSuccess(`Panel '${selectedPanel.name}' deleted successfully!`);
        setIsDeleteDialogOpen(false);
        setSelectedPanel(null);
      } catch (error) {
        // Error handled by AppContext
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Panels...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while panel data is being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Panels</CardTitle>
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
        <CardHeader>
          <CardTitle>Add New Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Panel 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Purpose of the panel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requires_panel3_credentials"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires Panel 3 Credentials</FormLabel>
                      <FormDescription>
                        Check if campaigns for this panel must use Panel 3 credentials.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Panel</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Panels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Requires Panel 3</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panels.map((panel) => (
                <TableRow key={panel.id}>
                  <TableCell className="font-medium">{panel.name}</TableCell>
                  <TableCell>{panel.description}</TableCell>
                  <TableCell>{panel.requires_panel3_credentials ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(panel)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(panel)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPanel && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Panel: {selectedPanel.name}</DialogTitle>
            </DialogHeader>
            <EditPanelForm
              panel={selectedPanel}
              onPanelUpdated={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedPanel && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to delete the panel "<strong>{selectedPanel.name}</strong>"?
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