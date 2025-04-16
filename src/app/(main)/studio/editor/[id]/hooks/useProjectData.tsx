// src/app/(main)/studio/editor/[id]/hooks/useProjectData.tsx
"use client";

import { useState, useEffect } from 'react';
import { Project, ProjectStats } from '@/types/projects';
import { projectService } from '@/services/api';
import { toast } from 'sonner';

export interface ProjectData {
  project: Project | null;
  stats: ProjectStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjectData(projectId: string): ProjectData {
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      // First get the project
      const response = await projectService.getProject(projectId);
      
      if (response.success && response.data) {
        const projectData = response.data;
        
        // For demo purposes, we'll add mock stats
        // In a real application, you would fetch this from an API
        const mockStats: ProjectStats = {
          chapters: 5,
          pages: 24,
          characters: 8,
          panels: 36,
          completion_percentage: 65
        };
        
        setProject(projectData);
        setStats(mockStats);
        setError(null);
      } else {
        setError(response.error || "Project not found");
        toast.error("Failed to load project");
      }
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError("Failed to load project data");
      toast.error("Error loading project data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  return {
    project,
    stats,
    isLoading,
    error,
    refetch: fetchProjectData
  };
}