// src/app/(main)/studio/projects/create/components/ProjectDetailsForm.tsx

import React from 'react';
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the schema for project details
const projectDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  genre: z.string().min(1, "Genre is required"),
  targetAudience: z.string().optional(),
  estimatedLength: z.number().int().positive().optional().nullable(),
  // Add publication schedule fields if needed
  tags: z.array(z.string()).optional(),
});

// Type definition using the schema
type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;

interface ProjectDetailsFormProps {
  onSubmit: (values: ProjectDetailsFormValues) => void;
  defaultValues?: Partial<ProjectDetailsFormValues>;
}

export function ProjectDetailsForm({ onSubmit, defaultValues }: ProjectDetailsFormProps) {
  const form = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      genre: '',
      targetAudience: '',
      estimatedLength: null,
      tags: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Existing title, description, genre fields */}
        
        {/* New fields */}
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="children">Children (7-12)</SelectItem>
                  <SelectItem value="teen">Teen (13-17)</SelectItem>
                  <SelectItem value="youngAdult">Young Adult (18-25)</SelectItem>
                  <SelectItem value="adult">Adult (18+)</SelectItem>
                  <SelectItem value="mature">Mature (21+)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Who is your manga intended for?</FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="estimatedLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Pages</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    field.onChange(e.target.value ? parseInt(e.target.value) : null)
                  }
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>Approximate number of pages in your manga</FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              {/* Implement tag input component with autocomplete */}
              <FormDescription>Add tags to help categorize your manga</FormDescription>
            </FormItem>
          )}
        />
        
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}