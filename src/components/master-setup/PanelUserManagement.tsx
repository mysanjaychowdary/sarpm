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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { showSuccess } from "@/utils/toast";
import { PanelUser } from "@/types"; // Import PanelUser type

const panelUserFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  passwordPlaceholder: z.string().min(6, { message: "Password must be at least 6 characters." }),
  panelId: z.string().min(1, { message: "Please select a panel." }),
  isActive: z.boolean().default(true),
});

export function PanelUserManagement() {
  const { panels, panelUsers, addPanelUser } = useAppContext();

  const form = useForm<z.infer<typeof panelUserFormSchema>>({
    resolver: zodResolver(panelUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      passwordPlaceholder: "",
      panelId: "",
      isActive: true,
    },
  });

  function onSubmit(values: z.infer<typeof panelUserFormSchema>) {
    addPanelUser(values as Omit<PanelUser, "id">);
    showSuccess("Panel user added successfully!");
    form.reset();
  }

  const getPanelName = (panelId: string) => {
    return panels.find((p) => p.id === panelId)?.name || "Unknown Panel";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Panel User</CardTitle>
        </CardHeader>
        <CardContent>
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
                name="passwordPlaceholder"
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
                name="panelId"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Panel Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Panel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panelUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getPanelName(user.panelId)}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}