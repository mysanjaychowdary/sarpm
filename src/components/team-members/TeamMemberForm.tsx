"use client";

import React from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { TeamMember } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/context/SessionContext"; // Import useSession to get the current session token

const teamMemberFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }), // For initial signup
  role: z.enum(["Team Member", "Admin"], {
    required_error: "Please select a role.",
  }),
  is_active: z.boolean().default(true),
});

interface TeamMemberFormProps {
  onMemberAdded?: () => void;
}

export function TeamMemberForm({ onMemberAdded }: TeamMemberFormProps) {
  const { fetchData } = useAppContext();
  const { session } = useSession(); // Get the current session

  const form = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Team Member",
      is_active: true,
    },
  });

  async function onSubmit(values: z.infer<typeof teamMemberFormSchema>) {
    if (!session) {
      showError("You must be logged in to add team members.");
      return;
    }

    try {
      // Invoke the Edge Function to create the team member
      const { data, error } = await supabase.functions.invoke('create-team-member', {
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          is_active: values.is_active,
        }),
        headers: {
          'Authorization': `Bearer ${session.access_token}`, // Pass the current user's token for authorization
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        showError("Failed to create team member: " + error.message);
        throw error;
      }

      if (data && data.message) {
        showSuccess(data.message);
        form.reset();
        await fetchData(); // Refresh the AppContext data to show the new member
        onMemberAdded?.();
      } else {
        showError("An unexpected error occurred during team member creation.");
      }
    } catch (error: any) {
      console.error("Error creating team member:", error);
      showError(error.message || "Failed to create team member.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter initial password" {...field} />
              </FormControl>
              <FormDescription>
                (User will be able to log in immediately since email confirmation is off)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active User</FormLabel>
                <FormDescription>
                  Mark user as active or inactive.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Team Member</Button>
      </form>
    </Form>
  );
}