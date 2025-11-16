"use client";

import React from "react";
import { useForm } from "@hookform/react-form";
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
import { PanelUser } from "@/types";

const panelUserFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password_placeholder: z.string().min(6, { message: "Password must be at least 6 characters." }), // Changed to snake_case
  panel_id: z.string().min(1, { message: "Please select a panel." }), // Changed to snake_case
  is_active: z.boolean().default(true), // Changed to snake_case
});

interface PanelUserFormProps {
  onUserAdded?: () => void;
}

export function PanelUserForm({ onUserAdded }: PanelUserFormProps) {
  const { panels, addPanelUser } = useAppContext();

  const form = useForm<z.infer<typeof panelUserFormSchema>>({
    resolver: zodResolver(panelUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password_placeholder: "",
      panel_id: "",
      is_active: true,
    },
  });

  async function onSubmit(values: z.infer<typeof panelUserFormSchema>) {
    try {
      await addPanelUser(values as Omit<PanelUser, "id">);
      showSuccess("Panel user added successfully!");
      form.reset();
      onUserAdded?.();
    } catch (error) {
      // Error handled by AppContext, just prevent further action
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g., john_doe" {...field} />
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
                <Input type="email" placeholder="e.g., john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormDescription>
                (In a real app, this would be encrypted)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Panel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a panel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {panels.filter(p => p.name !== "Panel 3").map((panel) => ( // Panel 3 is only for credentials
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
        <Button type="submit">Add Panel User</Button>
      </form>
    </Form>
  );
}