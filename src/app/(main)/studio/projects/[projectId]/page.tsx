// src/app/(main)/studio/projects/[projectId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Add this import for Loader2

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
  };
}

// Import your components - you need to create these files
// or comment them out if you haven't created them yet
import ProjectStats from './components/ProjectStats';
// Comment out or create these component files
/*
import RecentPages from './components/RecentPages';
import ActivityTimeline from './components/ActivityTimeline';
import ChapterOverview from './components/ChapterOverview';
import ProjectStructure from './components/ProjectStructure';
import QuickActions from './components/QuickActions';
*/

// Placeholder components until you create the actual ones
const RecentPages = ({ projectId }: { projectId: string }) => <div>Recent Pages</div>;
const ActivityTimeline = ({ projectId }: { projectId: string }) => <div>Activity Timeline</div>;
const ChapterOverview = ({ projectId }: { projectId: string }) => <div>Chapter Overview</div>;
const ProjectStructure = ({ project }: { project: Project }) => <div>Project Structure</div>;
const QuickActions = ({ project }: { project: Project }) => <div>Quick Actions</div>;

export default function ProjectDashboard() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch project data on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("You must be logged in to view this project");
          router.push('/studio/sign-in');
          return;
        }
        
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
          toast.error("Project not found");
          router.push('/studio/projects');
          return;
        }
        
        setProject(data as Project);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [params.projectId, router, supabase]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  // Project not found
  if (!project) {
    return null; // Router will handle redirect
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
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