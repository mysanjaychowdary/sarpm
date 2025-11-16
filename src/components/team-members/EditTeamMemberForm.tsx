"use client";

import React, { useEffect } from "react";
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

const teamMemberFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["Team Member", "Admin"], {
    required_error: "Please select a role.",
  }),
  is_active: z.boolean().default(true),
});

interface EditTeamMemberFormProps {
  teamMember: TeamMember;
  onMemberUpdated?: () => void;
}

export function EditTeamMemberForm({ teamMember, onMemberUpdated }: EditTeamMemberFormProps) {
  const { updateTeamMember } = useAppContext();

  const form = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      id: teamMember.id,
      name: teamMember.name,
      email: teamMember.email,
      role: teamMember.role as "Team Member" | "Admin",
      is_active: teamMember.is_active,
    },
  });

  useEffect(() => {
    form.reset({
      id: teamMember.id,
      name: teamMember.name,
      email: teamMember.email,
      role: teamMember.role as "Team Member" | "Admin",
      is_active: teamMember.is_active,
    });
  }, [teamMember, form]);

  async function onSubmit(values: z.infer<typeof teamMemberFormSchema>) {
    try {
      await updateTeamMember(values as TeamMember);
      showSuccess("Team member updated successfully!");
      onMemberUpdated?.();
    } catch (error) {
      // Error handled by AppContext, just prevent further action
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
                <Input type="email" placeholder="e.g., jane@example.com" {...field} disabled /> {/* Email usually not editable */}
              </FormControl>
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
              <Select onValueChange={field.onChange} value={field.value}> {/* Changed defaultValue to value */}
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
        <Button type="submit">Update Team Member</Button>
      </form>
    </Form>
  );
}