"use client";

import React, { useEffect } from "react";
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
import { useAppContext } from "@/context/AppContext";
import { showSuccess, showError } from "@/utils/toast";
import { Panel } from "@/types";

const panelFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Panel name must be at least 2 characters." }),
  description: z.string().optional(),
  requires_panel3_credentials: z.boolean().default(false), // Changed to snake_case
});

interface EditPanelFormProps {
  panel: Panel;
  onPanelUpdated?: () => void;
}

export function EditPanelForm({ panel, onPanelUpdated }: EditPanelFormProps) {
  const { updatePanel } = useAppContext();

  const form = useForm<z.infer<typeof panelFormSchema>>({
    resolver: zodResolver(panelFormSchema),
    defaultValues: {
      id: panel.id,
      name: panel.name,
      description: panel.description,
      requires_panel3_credentials: panel.requires_panel3_credentials,
    },
  });

  useEffect(() => {
    form.reset({
      id: panel.id,
      name: panel.name,
      description: panel.description,
      requires_panel3_credentials: panel.requires_panel3_credentials,
    });
  }, [panel, form]);

  async function onSubmit(values: z.infer<typeof panelFormSchema>) {
    try {
      await updatePanel(values as Panel);
      showSuccess("Panel updated successfully!");
      onPanelUpdated?.();
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
              <FormLabel>Panel Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Panel 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Purpose of the panel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requires_panel3_credentials"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Requires Panel 3 Credentials</FormLabel>
                <FormDescription>
                  Check if campaigns for this panel must use Panel 3 credentials.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Panel</Button>
      </form>
    </Form>
  );
}