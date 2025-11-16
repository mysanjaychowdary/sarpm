"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { v4 as uuidv4 } from "uuid";

const campaignFormSchema = z.object({
  campaignId: z.string().min(1, { message: "Campaign ID is required." }),
  campaignName: z.string().min(2, { message: "Campaign name must be at least 2 characters." }),
  panelId: z.string().min(1, { message: "Please select a panel." }),
  panelUserId: z.string().min(1, { message: "Please select a panel user." }),
  panel3CredentialId: z.string().optional(),
  panel3PasswordPlaceholder: z.string().optional(),
});

export function CampaignEntryForm() {
  const { panels, panelUsers, panel3Credentials, addCampaignReport } = useAppContext();
  const [selectedPanelRequiresPanel3, setSelectedPanelRequiresPanel3] = useState(false);

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignId: uuidv4().substring(0, 8), // Auto-generate a short ID
      campaignName: "",
      panelId: "",
      panelUserId: "",
      panel3CredentialId: "",
      panel3PasswordPlaceholder: "",
    },
  });

  const selectedPanelId = form.watch("panelId");
  const filteredPanelUsers = panelUsers.filter(user => user.panelId === selectedPanelId);

  useEffect(() => {
    const panel = panels.find(p => p.id === selectedPanelId);
    setSelectedPanelRequiresPanel3(panel?.requiresPanel3Credentials || false);
    if (!panel?.requiresPanel3Credentials) {
      form.setValue("panel3CredentialId", "");
      form.setValue("panel3PasswordPlaceholder", "");
    }
    // Reset panel user if selected panel changes
    form.setValue("panelUserId", "");
  }, [selectedPanelId, panels, form]);

  function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    if (selectedPanelRequiresPanel3 && (!values.panel3CredentialId || !values.panel3PasswordPlaceholder)) {
      showError("Panel 3 user and password are required for Panel 2 campaigns.");
      return;
    }

    addCampaignReport({
      campaignId: values.campaignId,
      campaignName: values.campaignName,
      panelId: values.panelId,
      panelUserId: values.panelUserId,
      panel3CredentialId: values.panel3CredentialId || undefined,
      panel3PasswordPlaceholder: values.panel3PasswordPlaceholder || undefined,
      status: "Pending",
    });
    showSuccess("Campaign report created successfully!");
    form.reset({
      campaignId: uuidv4().substring(0, 8),
      campaignName: "",
      panelId: "",
      panelUserId: "",
      panel3CredentialId: "",
      panel3PasswordPlaceholder: "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="campaignId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign ID</FormLabel>
              <FormControl>
                <Input placeholder="Unique Campaign ID" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Sale Campaign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Panel</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a panel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {panels.filter(p => p.name !== "Panel 3").map((panel) => ( // Only Panel 1 & 2 for campaign entry
                    <SelectItem key={panel.id} value={panel.id}>
                      {panel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panelUserId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select User From Panel</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPanelId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredPanelUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedPanelRequiresPanel3 && (
          <div className="space-y-4 border p-4 rounded-md bg-muted/50">
            <h3 className="text-lg font-semibold">Panel 3 Assignment</h3>
            <FormField
              control={form.control}
              name="panel3CredentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Panel 3 User (Email)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Panel 3 user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {panel3Credentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="panel3PasswordPlaceholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Panel 3 Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Panel 3 Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit">Create Campaign Record</Button>
      </form>
    </Form>
  );
}