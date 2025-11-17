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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { v4 as uuidv4 } from "uuid";
import { RefreshCcw, CalendarIcon } from "lucide-react";
import { CampaignType } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { useSession } from "@/context/SessionContext"; // Import useSession

const campaignFormSchema = z.object({
  campaign_id: z.string().min(1, { message: "Campaign ID is required." }), // Auto-generate a short ID
  campaign_name: z.string().min(2, { message: "Campaign name must be at least 2 characters." }),
  panel_id: z.string().min(1, { message: "Please select a panel." }),
  panel_user_id: z.string().min(1, { message: "Please select a panel user." }),
  panel3_credential_id: z.string().optional(),
  panel3_password_placeholder: z.string().optional(),
  campaign_type: z.enum(["Normal", "Priority", "Urgent"], {
    required_error: "Please select a campaign type.",
  }),
  campaign_date: z.date({
    required_error: "A campaign date is required.",
  }),
});

interface CampaignEntryFormProps {
  onCampaignAdded?: () => void;
}

export function CampaignEntryForm({ onCampaignAdded }: CampaignEntryFormProps) {
  const { panels, panelUsers, panel3Credentials, addCampaignReport, smsApiCredentials } = useAppContext();
  const { session } = useSession();
  const [selectedPanelRequiresPanel3, setSelectedPanelRequiresPanel3] = useState(false);

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaign_id: uuidv4().substring(0, 8), // Auto-generate a short ID
      campaign_name: "",
      panel_id: "",
      panel_user_id: "",
      panel3_credential_id: "",
      panel3_password_placeholder: "",
      campaign_type: "Normal", // Default campaign type
      campaign_date: new Date(), // Default to today
    },
  });

  const selectedPanelId = form.watch("panel_id");
  const filteredPanelUsers = panelUsers.filter(user => user.panel_id === selectedPanelId);

  useEffect(() => {
    const panel = panels.find(p => p.id === selectedPanelId);
    setSelectedPanelRequiresPanel3(panel?.requires_panel3_credentials || false);
    if (!panel?.requires_panel3_credentials) {
      form.setValue("panel3_credential_id", "");
      form.setValue("panel3_password_placeholder", "");
    }
    // Reset panel user if selected panel changes
    form.setValue("panel_user_id", "");
  }, [selectedPanelId, panels, form]);

  const generateNewCampaignId = () => {
    form.setValue("campaign_id", uuidv4().substring(0, 8));
  };

  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    if (selectedPanelRequiresPanel3 && (!values.panel3_credential_id || !values.panel3_password_placeholder)) {
      showError("Panel 3 user and password are required for Panel 2 campaigns.");
      return;
    }

    try {
      await addCampaignReport({
        campaign_id: values.campaign_id,
        campaign_name: values.campaign_name,
        panel_id: values.panel_id,
        panel_user_id: values.panel_user_id,
        panel3_credential_id: values.panel3_credential_id || undefined,
        panel3_password_placeholder: values.panel3_password_placeholder || undefined,
        status: "Pending",
        campaign_type: values.campaign_type,
        campaign_date: values.campaign_date.toISOString(), // Save as ISO string
      });
      showSuccess("Campaign report created successfully!");
      
      // --- SMS Notification Logic ---
      if (smsApiCredentials.length > 0 && session) {
        const panelUserName = panelUsers.find(u => u.id === values.panel_user_id)?.username || "a user";
        const smsMessage = `New campaign "${values.campaign_name}" (${values.campaign_id}) created for ${panelUserName} on ${format(values.campaign_date, "PPP")}. Type: ${values.campaign_type}.`;
        
        const firstSmsCredential = smsApiCredentials[0]; // Use the first available credential
        const recipientPhoneNumber = firstSmsCredential.mobile_number;
        const instanceId = firstSmsCredential.instance_id;
        const accessToken = firstSmsCredential.access_token;

        if (!recipientPhoneNumber) {
          console.warn("No recipient mobile number configured for SMS notifications. Skipping SMS.");
          showError("No recipient mobile number configured for SMS notifications.");
        } else {
          try {
            const encodedMessage = encodeURIComponent(smsMessage);
            const smsApiUrl = `https://whatsupsms.in/api/send?number=${recipientPhoneNumber}&type=text&message=${encodedMessage}&instance_id=${instanceId}&access_token=${accessToken}`;

            const smsResponse = await fetch(smsApiUrl);
            const smsData = await smsResponse.json();

            if (!smsResponse.ok) {
              console.error('SMS API error:', smsData);
              showError('Failed to send SMS: ' + (smsData.message || 'Unknown error'));
            } else {
              showSuccess("SMS notification sent: " + smsData.message);
            }
          } catch (smsError: any) {
            console.error("Unexpected error sending SMS:", smsError);
            showError("An unexpected error occurred while sending SMS: " + smsError.message);
          }
        }
      } else if (smsApiCredentials.length === 0) {
        console.warn("No SMS API credentials configured. Skipping SMS notification.");
      } else if (!session) {
        console.warn("User session not available. Skipping SMS notification.");
      }
      // --- End SMS Notification Logic ---

      form.reset({
        campaign_id: uuidv4().substring(0, 8),
        campaign_name: "",
        panel_id: "",
        panel_user_id: "",
        panel3_credential_id: "",
        panel3_password_placeholder: "",
        campaign_type: "Normal",
        campaign_date: new Date(),
      });
      onCampaignAdded?.(); // Call callback to close dialog
    } catch (error) {
      // Error handled by AppContext, just prevent further action
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="campaign_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign ID</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Unique Campaign ID" {...field} />
                  <Button type="button" variant="outline" size="icon" onClick={generateNewCampaignId}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campaign_name"
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
          name="campaign_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Priority">Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campaign_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Campaign Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panel_id"
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
          name="panel_user_id"
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
              name="panel3_credential_id"
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
              name="panel3_password_placeholder"
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