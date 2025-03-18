// src/app/(main)/studio/projects/[projectId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Project-related components
import ProjectStats from './components/ProjectStats';
import RecentPages from './components/RecentPages';
import ActivityTimeline from './components/ActivityTimeline';
import ChapterOverview from './components/ChapterOverview';
import ProjectStructure from './components/ProjectStructure';
import QuickActions from './components/QuickActions';

// Define Project interface
interface Project {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  metadata: {
    genre: string;
    template_type: string;
    template_id: string | null;
    cover_image?: string;
    progress?: number;
    target_audience?: string;
    estimated_pages?: number;
    tags?: string[];
  };
}

export default function ProjectDashboard() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch project data on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("You must be logged in to view this project");
          router.push('/studio/sign-in');
          return;
        }
        
        // Fetch project data
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.projectId)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError("Project not found");
          toast.error("Project not found");
          return;
        }
        
        setProject(data as Project);
      } catch (error: any) {
        console.error("Error fetching project:", error);
        setError(error.message || "Failed to load project");
        toast.error(error.message || "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [params.projectId, router, supabase]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error loading project</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => router.push('/studio/projects')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Projects
          </button>
        </div>
      </div>
    );
  }
  
  // Project not found
  if (!project) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-muted p-6 rounded-lg border border-border max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button 
            onClick={() => router.push('/studio/projects')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
          
          <QuickActions project={project} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ProjectStats project={project} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentPages projectId={project.id} />
          <ChapterOverview projectId={project.id} />
        </div>
        
        <div className="space-y-6">
          <ProjectStructure project={project} />
          <ActivityTimeline projectId={project.id} />
        </div>
      </div>
    </div>
  );
}