"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/protected-route';

// Constants
import { 
  projectCreationSteps, 
  genreOptions, 
  mockTemplates, 
  templateTypeOptions 
} from '@/components/constants/projects';

// Icons
import { 
  ArrowLeft, 
  ArrowRight, 
  Image as ImageIcon, 
  Bookmark, 
  BookOpen, 
  Check, 
  Layers, 
  X,
  Plus 
} from 'lucide-react';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from '@/lib/utils';

// Form schemas for each step
const projectDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  genre: z.string().min(1, "Genre is required"),
});

const templateSelectionSchema = z.object({
  templateType: z.enum(["blank", "basic", "detailed", "custom"]),
  templateId: z.string().optional(),
});

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    genre: '',
    templateType: 'blank',
    templateId: '',
  });
  
  const supabase = createClient();
  const router = useRouter();
  
  // Forms for each step
  const detailsForm = useForm<z.infer<typeof projectDetailsSchema>>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      title: projectData.title,
      description: projectData.description,
      genre: projectData.genre,
    },
  });
  
  const templateForm = useForm<z.infer<typeof templateSelectionSchema>>({
    resolver: zodResolver(templateSelectionSchema),
    defaultValues: {
      templateType: projectData.templateType as any,
      templateId: projectData.templateId,
    },
  });
  
  // Filter templates based on type
  const getFilteredTemplates = (type: string) => {
    return mockTemplates.filter(template => template.type === type);
  };
  
  // Handle form submissions for each step
  const onDetailsSubmit = (data: z.infer<typeof projectDetailsSchema>) => {
    setProjectData(prev => ({ ...prev, ...data }));
    nextStep();
  };
  
  const onTemplateSubmit = (data: z.infer<typeof templateSelectionSchema>) => {
    setProjectData(prev => ({ ...prev, ...data }));
    nextStep();
  };
  
  // Navigation between steps
  const nextStep = () => {
    if (currentStep < projectCreationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Project creation
  const createProject = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a project");
        return;
      }
      
      // Create project in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectData.title,
          description: projectData.description || null,
          status: 'draft',
          metadata: {
            genre: projectData.genre,
            template_type: projectData.templateType,
            template_id: projectData.templateId || null,
          }
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast.success("Project created successfully!");
      
      // Redirect to the new project
      router.push(`/studio/projects/${data.id}`);
      
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Plus':
        return <Plus className="h-5 w-5" />;
      case 'Layers':
        return <Layers className="h-5 w-5" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5" />;
      case 'Bookmark':
        return <Bookmark className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (projectCreationSteps[currentStep].id) {
      case 'details':
        return (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-6">
              <FormField
                control={detailsForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Manga" {...field} />
                    </FormControl>
                    <FormDescription>Give your manga project a memorable name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={detailsForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief description of your manga project..." 
                        className="resize-none h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Describe what your manga is about (optional).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={detailsForm.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genreOptions.map((genre) => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the genre that best fits your manga.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 'template':
        return (
          <Form {...templateForm}>
            <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-8">
              <FormField
                control={templateForm.control}
                name="templateType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Template Type <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        {templateTypeOptions.map((template) => (
                          <div key={template.value} className="col-span-1">
                            <RadioGroupItem value={template.value} id={template.value} className="peer sr-only" />
                            <label
                              htmlFor={template.value}
                              className="flex flex-col items-center justify-between border-2 border-muted rounded-lg p-4 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                            >
                              <div className="rounded-full bg-muted p-2 mb-2">
                                {getIconComponent(template.icon)}
                              </div>
                              <div className="font-semibold">{template.label}</div>
                              <div className="text-xs text-muted-foreground text-center mt-1">
                                {template.description}
                              </div>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Show specific templates based on selection */}
              {templateForm.watch("templateType") !== "blank" && (
                <FormField
                  control={templateForm.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Template</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {templateForm.watch("templateType") === "custom" ? (
                            <div className="col-span-full text-center py-10">
                              <p className="text-muted-foreground mb-4">You haven't saved any custom templates yet.</p>
                              <Button variant="outline">Create a Custom Template</Button>
                            </div>
                          ) : (
                            getFilteredTemplates(templateForm.watch("templateType")).map((template) => (
                              <div 
                                key={template.id}
                                className={cn(
                                  "relative border rounded-lg overflow-hidden group cursor-pointer transition-all",
                                  field.value === template.id 
                                    ? "border-primary ring-2 ring-primary/20" 
                                    : "border-muted hover:border-primary/50"
                                )}
                                onClick={() => field.onChange(template.id)}
                              >
                                <div className="aspect-[4/3] bg-muted relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                                  </div>
                                  
                                  {/* Placeholder for template preview image */}
                                  {/* <Image src={template.image} alt={template.name} fill className="object-cover" /> */}
                                  
                                  {/* Selection indicator */}
                                  {field.value === template.id && (
                                    <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-4">
                                  <h3 className="font-medium">{template.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex gap-2">
                                      {template.tags.map((tag) => (
                                        <span 
                                          key={tag} 
                                          className="text-xs px-2 py-1 bg-muted rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {template.pages} pages
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </FormControl>
                      {templateForm.watch("templateType") !== "blank" && 
                       templateForm.watch("templateType") !== "custom" && (
                        <FormDescription>
                          Choose a template for your project. You can customize it later.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 'preview':
        return (
          <div className="space-y-8">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold">{projectData.title}</h3>
                {projectData.description && (
                  <p className="text-muted-foreground mt-2">{projectData.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Genre</p>
                    <p className="font-medium">
                      {genreOptions.find(g => g.value === projectData.genre)?.label || projectData.genre}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Template Type</p>
                    <p className="font-medium">
                      {templateTypeOptions.find(t => t.value === projectData.templateType)?.label || projectData.templateType}
                    </p>
                  </div>
                  
                  {projectData.templateId && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Selected Template</p>
                      <p className="font-medium">
                        {mockTemplates.find(t => t.id === projectData.templateId)?.name || "Custom Template"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="p-6 bg-background">
                <h4 className="font-medium mb-4">What happens next?</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Your project will be created with the settings you specified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>You'll be taken to the project editor where you can start creating pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>If you selected a template, it will be pre-loaded with starter content</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={createProject} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/studio')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-1">Set up your manga project in a few simple steps</p>
        </div>
        
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-muted w-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all"
              style={{ width: `${(currentStep / (projectCreationSteps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Step circles */}
            {projectCreationSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={cn(
                  "relative flex flex-col items-center gap-2",
                  index < currentStep 
                    ? "text-primary" 
                    : index === currentStep 
                      ? "text-primary" 
                      : "text-muted-foreground"
                )}
              >
                <div 
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full",
                    index < currentStep 
                      ? "bg-primary text-white" 
                      : index === currentStep 
                        ? "bg-white border-2 border-primary" 
                        : "bg-white border-2 border-muted"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current step content */}
        <Card>
          <CardHeader>
            <CardTitle>{projectCreationSteps[currentStep].title}</CardTitle>
            <CardDescription>
              {projectCreationSteps[currentStep].id === 'details' && "Enter basic information about your manga project"}
              {projectCreationSteps[currentStep].id === 'template' && "Choose a template or start from scratch"}
              {projectCreationSteps[currentStep].id === 'preview' && "Review your project details before creation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}