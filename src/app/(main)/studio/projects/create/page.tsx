"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/global/protected-route';
import { projectService } from '@/services/api';

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
  Plus,
  Loader2,
  PenTool,
  FileText
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      
      // Create project using the API service
      const response = await projectService.createProject({
        title: projectData.title,
        description: projectData.description || null,
        status: 'draft',
        metadata: {
          genre: projectData.genre,
          template_type: projectData.templateType,
          template_id: projectData.templateId || null,
          progress: 0
        }
      });
      
      if (!response.success) {
        setError(response.error || "Failed to create project");
        return;
      }
      
      // Redirect to the new project
      if (response.data && response.data.id) {
        router.push(`/studio/projects/${response.data.id}`);
      } else {
        throw new Error("Project created but no ID returned");
      }
      
    } catch (error: any) {
      setError(error.message || "Failed to create project");
      toast.error(error.message || "Failed to create project");
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
  
  // Get template icon by type
  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'action':
        return <PenTool className="h-4 w-4 text-red-500" />;
      case 'romance':
        return <FileText className="h-4 w-4 text-pink-500" />;
      case 'horror':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (projectCreationSteps[currentStep].id) {
      case 'details':
        return (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-6">
              <div className="space-y-5">
                <FormField
                  control={detailsForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white text-base">Project Title <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Awesome Manga" 
                          {...field} 
                          className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 h-11 px-4 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
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
                      <FormLabel className="text-gray-900 dark:text-white text-base">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief description of your manga project..." 
                          className="resize-none h-32 bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                      <FormLabel className="text-gray-900 dark:text-white text-base">Genre <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
                          {genreOptions.map((genre) => (
                            <SelectItem 
                              key={genre.value} 
                              value={genre.value}
                              className="text-gray-800 dark:text-white/80 focus:text-gray-900 focus:bg-gray-100 dark:focus:text-white dark:focus:bg-white/10"
                            >
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
              </div>
              
              <div className="flex justify-end pt-4 mt-6">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-white px-6 py-2.5 h-auto"
                >
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
                  <FormItem className="space-y-4">
                    <FormLabel className="text-gray-900 dark:text-white text-base">Template Type <span className="text-destructive">*</span></FormLabel>
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
                              className="flex flex-col items-center justify-between border-2 border-gray-200 dark:border-white/10 rounded-xl p-5 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full"
                            >
                              <div className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 p-4 mb-4 shadow-sm">
                                {getIconComponent(template.icon)}
                              </div>
                              <div className="font-medium text-center text-gray-900 dark:text-white">{template.label}</div>
                              <div className="text-xs text-gray-600 dark:text-white/60 text-center mt-3">
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
                      <FormLabel className="text-gray-900 dark:text-white text-base">Select Template</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                          {templateForm.watch("templateType") === "custom" ? (
                            <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl p-8 border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                              <Bookmark className="h-14 w-14 text-gray-400 dark:text-white/20 mx-auto mb-5 opacity-70" />
                              <p className="text-gray-600 dark:text-white/60 mb-5 text-lg">You haven't saved any custom templates yet.</p>
                              <Button 
                                variant="outline"
                                className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                              >
                                Create a Custom Template
                              </Button>
                            </div>
                          ) : (
                            getFilteredTemplates(templateForm.watch("templateType")).map((template) => (
                              <motion.div 
                                key={template.id}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                className={cn(
                                  "relative border-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300",
                                  field.value === template.id 
                                    ? "border-primary ring-2 ring-primary/20 shadow-md shadow-primary/10" 
                                    : "border-gray-200 dark:border-white/10 hover:border-primary/50 hover:shadow-md"
                                )}
                                onClick={() => field.onChange(template.id)}
                              >
                                <div className="aspect-[4/3] bg-gray-100 dark:bg-white/5 relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-400 dark:text-white/20" />
                                  </div>
                                  
                                  {/* Template type badge */}
                                  <div className="absolute top-3 left-3">
                                    <Badge variant="outline" className="bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-sm">
                                      {getTemplateIcon(template.type)}
                                      <span className="ml-1 font-medium">{template.type}</span>
                                    </Badge>
                                  </div>
                                  
                                  {/* Selection indicator */}
                                  {field.value === template.id && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-white p-1.5 rounded-full shadow-md">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-5">
                                  <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">{template.name}</h3>
                                  <p className="text-sm text-gray-600 dark:text-white/60 mt-1 line-clamp-2">{template.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex flex-wrap gap-1.5">
                                      {template.tags.slice(0, 2).map((tag) => (
                                        <span 
                                          key={tag} 
                                          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {template.tags.length > 2 && (
                                        <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 rounded-full">
                                          +{template.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-primary dark:text-primary/90 font-medium bg-primary/5 px-2.5 py-1 rounded-full">
                                      {template.pages} pages
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </FormControl>
                      {templateForm.watch("templateType") !== "blank" && 
                       templateForm.watch("templateType") !== "custom" && (
                        <FormDescription className="mt-3">
                          Choose a template for your project. You can customize it later.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-between pt-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-white px-6 py-2.5 h-auto"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 'preview':
        return (
          <div className="space-y-8">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-5 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-md">
              <div className="p-6 bg-white dark:bg-white/[0.02]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{projectData.title}</h3>
                {projectData.description && (
                  <p className="text-gray-600 dark:text-white/60 mt-2">{projectData.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-8">
                  <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-white/40">Genre</p>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">
                      {genreOptions.find(g => g.value === projectData.genre)?.label || projectData.genre}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-white/40">Template Type</p>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">
                      {templateTypeOptions.find(t => t.value === projectData.templateType)?.label || projectData.templateType}
                    </p>
                  </div>
                  
                  {projectData.templateId && (
                    <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-white/[0.03] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-white/40">Selected Template</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">
                        {mockTemplates.find(t => t.id === projectData.templateId)?.name || "Custom Template"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="border-gray-200 dark:border-white/10" />
              
              <div className="p-6 bg-gray-50 dark:bg-white/[0.02]">
                <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-4">What happens next?</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-white/80">Your project will be created with the settings you specified</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-white/80">You'll be taken to the project dashboard where you can start creating pages</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-white/80">If you selected a template, it will be pre-loaded with starter content</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between pt-6 mt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={createProject} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-white px-8 py-2.5 h-auto font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <motion.div 
        className="container max-w-4xl mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/studio/projects')}
            className="mb-4 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">Create New Project</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">Set up your manga project in a few simple steps</p>
        </div>
        
        {/* Enhanced Step indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gray-200 dark:bg-white/10 w-full rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-in-out rounded-full"
              style={{ width: `${(currentStep / (projectCreationSteps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Step circles */}
            {projectCreationSteps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ 
                  scale: index === currentStep ? 1.1 : 1,
                  opacity: 1
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative flex flex-col items-center gap-2",
                  index < currentStep 
                    ? "text-primary" 
                    : index === currentStep 
                      ? "text-primary" 
                      : "text-gray-400 dark:text-white/40"
                )}
              >
                <div 
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 shadow-sm",
                    index < currentStep 
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30" 
                      : index === currentStep 
                        ? "bg-white dark:bg-gray-800 border-2 border-primary shadow-lg shadow-primary/20" 
                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-white/20"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block mt-1">{step.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Current step content with enhanced styling */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b border-gray-200 dark:border-white/10 pb-4 bg-gray-50/50 dark:bg-white/[0.03]">
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-3 text-white text-sm">
                  {currentStep + 1}
                </div>
                {projectCreationSteps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-white/60 pl-11">
                {projectCreationSteps[currentStep].id === 'details' && "Enter basic information about your manga project"}
                {projectCreationSteps[currentStep].id === 'template' && "Choose a template or start from scratch"}
                {projectCreationSteps[currentStep].id === 'preview' && "Review your project details before creation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Tips section with enhanced styling */}
        <motion.div 
          className="mt-10 p-5 border border-primary/20 bg-primary/5 rounded-xl overflow-hidden relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-10 -mt-10 transform rotate-12"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="text-primary mt-0.5 bg-primary/10 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3337C14.6024 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6024 1.66699 10 1.66699C5.39765 1.66699 1.66669 5.39795 1.66669 10.0003C1.66669 14.6027 5.39765 18.3337 10 18.3337Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.66699V10.0003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 13.333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-primary mb-2">Tips for this step</h4>
              <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                {projectCreationSteps[currentStep].id === 'details' && "Choose a unique title and clear description to help identify your project. The genre helps organize your work and will be used for recommendations."}
                {projectCreationSteps[currentStep].id === 'template' && "Templates give you a head start with pre-defined layouts and structure. Starting blank gives you complete freedom but requires more setup."}
                {projectCreationSteps[currentStep].id === 'preview' && "Double-check your project details before creating. You can still edit these settings later, but getting it right from the start saves time."}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
}