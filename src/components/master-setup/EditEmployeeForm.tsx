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
import { showSuccess } from "@/utils/toast";
import { Employee } from "@/types";

const employeeFormSchema = z.object({
  id: z.string(), // Include ID for updates
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  passwordPlaceholder: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal("")), // Password can be optional for edit, or empty string
  role: z.enum(["Admin", "Campaign Manager"], {
    required_error: "Please select a role.",
  }),
  isActive: z.boolean().default(true),
});

interface EditEmployeeFormProps {
  employee: Employee;
  onEmployeeUpdated?: () => void;
}

export function EditEmployeeForm({ employee, onEmployeeUpdated }: EditEmployeeFormProps) {
  const { updateEmployee } = useAppContext();

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      passwordPlaceholder: "", // Don't pre-fill password for security
      role: employee.role,
      isActive: employee.isActive,
    },
  });

  // Reset form with new employee data if employee prop changes
  useEffect(() => {
    form.reset({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      passwordPlaceholder: "",
      role: employee.role,
      isActive: employee.isActive,
    });
  }, [employee, form]);

  function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    const updatedEmployee: Employee = {
      ...employee, // Keep existing password if not changed
      id: values.id,
      name: values.name,
      email: values.email,
      role: values.role,
      isActive: values.isActive,
      passwordPlaceholder: values.passwordPlaceholder || employee.passwordPlaceholder, // Use new password if provided, else keep old
    };
    updateEmployee(updatedEmployee);
    showSuccess("Employee updated successfully!");
    onEmployeeUpdated?.();
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
          name="passwordPlaceholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (Leave blank to keep current)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Campaign Manager">Campaign Manager</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active Employee</FormLabel>
                <FormDescription>
                  Mark employee as active or inactive.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Employee</Button>
      </form>
    </Form>
  );
}