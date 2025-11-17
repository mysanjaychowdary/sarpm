"use client";

import React, { useEffect } from "react";
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

const smsApiCredentialFormSchema = z.object({
  id: z.string(),
  instance_id: z.string().min(1, { message: "Instance ID is required." }),
  access_token: z.string().min(1, { message: "Access Token is required." }),
  created_by: z.string(),
  created_at: z.string(),
});

interface EditSmsApiCredentialFormProps {
  credential: SmsApiCredential;
  onCredentialUpdated?: () => void;
}

export function EditSmsApiCredentialForm({ credential, onCredentialUpdated }: EditSmsApiCredentialFormProps) {
  const { updateSmsApiCredential } = useAppContext();

  const form = useForm<z.infer<typeof smsApiCredentialFormSchema>>({
    resolver: zodResolver(smsApiCredentialFormSchema),
    defaultValues: {
      id: credential.id,
      instance_id: credential.instance_id,
      access_token: credential.access_token,
      created_by: credential.created_by,
      created_at: credential.created_at,
    },
  });

  useEffect(() => {
    form.reset({
      id: credential.id,
      instance_id: credential.instance_id,
      access_token: credential.access_token,
      created_by: credential.created_by,
      created_at: credential.created_at,
    });
  }, [credential, form]);

  async function onSubmit(values: z.infer<typeof smsApiCredentialFormSchema>) {
    try {
      await updateSmsApiCredential(values as SmsApiCredential);
      showSuccess("SMS API credential updated successfully!");
      onCredentialUpdated?.();
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
        <Button type="submit">Update Credential</Button>
      </form>
    </Form>
  );
}