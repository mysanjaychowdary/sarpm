"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";
import { showSuccess } from "@/utils/toast";
import { Eye, EyeOff, Copy } from "lucide-react";
import { Panel3Credential } from "@/types"; // Import Panel3Credential type

const panel3CredentialFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  apiPasswordPlaceholder: z.string().min(6, { message: "API password must be at least 6 characters." }),
});

export function Panel3CredentialManagement() {
  const { panel3Credentials, addPanel3Credential } = useAppContext();
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const form = useForm<z.infer<typeof panel3CredentialFormSchema>>({
    resolver: zodResolver(panel3CredentialFormSchema),
    defaultValues: {
      email: "",
      apiPasswordPlaceholder: "",
    },
  });

  function onSubmit(values: z.infer<typeof panel3CredentialFormSchema>) {
    addPanel3Credential(values as Omit<Panel3Credential, "id">);
    showSuccess("Panel 3 credential added successfully!");
    form.reset();
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Password copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Panel 3 Credential</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Panel 3 Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email / Login ID</TableHead>
                <TableHead>API Password</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panel3Credentials.map((credential) => (
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
                    {/* Add Update/Reset functionality here */}
                    <Button variant="outline" size="sm">Update</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}