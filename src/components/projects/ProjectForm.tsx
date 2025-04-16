"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProjectStatus, Project, ProjectGenre, ArtStyle } from '@/types/projects';
import { artStyleOptions, genreOptions, projectStatusOptions } from '@/components/constants/projects';
import { projectService } from '@/services/project-service';

// Define schema for project form
const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  status: z.enum(['draft', 'in-progress', 'completed', 'archived'] as const),
  genre: z.enum([
    'action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 
    'mystery', 'romance', 'sci-fi', 'slice-of-life', 'sports', 
    'supernatural', 'thriller', 'historical', 'mecha', 'psychological', 'other'
  ] as const),
  artStyle: z.enum([
    'anime-forge', 'studio-ghibli', 'modern-manga', 'classic-anime', 
    'shoujo', 'shounen', 'seinen', 'josei', 'realistic', 'chibi', 'custom'
  ] as const).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: Project;
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
  submitLabel?: string;
  mode?: 'create' | 'edit';
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSuccess,
  onCancel,
  submitLabel = "Save Project",
  mode = 'create'
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with project data if in edit mode
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      status: (project?.status as ProjectStatus) || "draft",
      genre: (project?.metadata?.genre as ProjectGenre) || "adventure",
      artStyle: (project?.metadata?.artStyle as ArtStyle) || "anime-forge",
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    
    try {
      let result: Project | null;
      
      if (mode === 'edit' && project) {
        // Update existing project
        result = await projectService.updateProject({
          id: project.id,
          title: values.title,
          description: values.description || null,
          status: values.status,
          metadata: {
            genre: values.genre,
            artStyle: values.artStyle,
          }
        });
      } else {
        // Create new project
        result = await projectService.createProject({
          title: values.title,
          description: values.description,
          status: values.status,
          metadata: {
            genre: values.genre,
            artStyle: values.artStyle,
            template_type: 'blank',
          }
        });
      }
      
      if (result) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(result);
        } else {
          // Navigate to the project page
          router.push(`/studio/projects/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormDescription>
                Give your manga project a memorable title
              </FormDescription>
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
                <Textarea 
                  placeholder="Brief description of your project" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Summarize what your manga is about
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genreOptions.map(genre => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The main genre of your manga
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="artStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an art style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {artStyleOptions.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The visual style for your manga
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectStatusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Current status of your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;