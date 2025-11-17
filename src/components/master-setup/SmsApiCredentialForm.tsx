"use client";

import React from "react";
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
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { SmsApiCredential } from "@/types";
import { useSession } from "@/context/SessionContext";

const smsApiCredentialFormSchema = z.object({
  instance_id: z.string().min(1, { message: "Instance ID is required." }),
  access_token: z.string().min(1, { message: "Access Token is required." }),
});

interface SmsApiCredentialFormProps {
  onCredentialAdded?: () => void;
}

export function SmsApiCredentialForm({ onCredentialAdded }: SmsApiCredentialFormProps) {
  const { addSmsApiCredential } = useAppContext();
  const { user } = useSession();

  const form = useForm<z.infer<typeof smsApiCredentialFormSchema>>({
    resolver: zodResolver(smsApiCredentialFormSchema),
    defaultValues: {
      instance_id: "",
      access_token: "",
    },
  });

  async function onSubmit(values: z.infer<typeof smsApiCredentialFormSchema>) {
    if (!user) {
      showError("You must be logged in to add API credentials.");
      return;
    }
    try {
      await addSmsApiCredential({
        instance_id: values.instance_id,
        access_token: values.access_token,
      });
      showSuccess("SMS API credential added successfully!");
      form.reset();
      onCredentialAdded?.();
    } catch (error) {
      // Error handled by AppContext
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="instance_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instance ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 609ACF283XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="access_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter API access token" {...field} />
              </FormControl>
              <FormDescription>
                (This token would be encrypted in a production environment)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Credential</Button>
      </form>
    </Form>
  );
}