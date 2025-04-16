// src/services/project-service.ts
import { toast } from "sonner";
import { Project, ProjectStats, Chapter } from "@/types/projects";

// Response interface for API returns
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

// Base API fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || `Request failed with status ${response.status}`;
      console.error(`API Error (${endpoint}):`, new Error(errorMessage));
      return { success: false, data: null, error: errorMessage };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    return { 
      success: false, 
      data: null, 
      error: error.message || "An unexpected error occurred" 
    };
  }
}

// Project service
export const projectService = {
  // Get all projects for the current user
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetchAPI<Project[]>('/projects');
      
      if (!response.success) {
        toast.error(response.error || "Failed to load projects");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to load projects");
      return { 
        success: false, 
        data: [], 
        error: error.message || "Failed to load projects" 
      };
    }
  },

  // Get project by ID
  async getProject(id: string): Promise<ApiResponse<Project>> {
    try {
      const response = await fetchAPI<Project>(`/projects/${id}`);
      
      if (!response.success) {
        toast.error(response.error || "Failed to load project");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to load project");
      return { 
        success: false, 
        data: null, 
        error: error.message || "Failed to load project" 
      };
    }
  },

  // Get project with statistics
  async getProjectWithStats(id: string): Promise<ApiResponse<Project & { stats?: ProjectStats }>> {
    try {
      const response = await fetchAPI<Project>(`/projects/${id}`);
      
      if (!response.success) {
        return response;
      }
      
      // Calculate or fetch project statistics
      // This is a placeholder - in a real app this would either be:
      // 1. Included in the API response from the backend
      // 2. Fetched with a separate API call
      // 3. Calculated based on the project data
      const projectStats: ProjectStats = {
        chapters: 3,
        pages: 12,
        characters: 5,
        panels: 24,
        completion_percentage: 75
      };
      
      return {
        success: true,
        data: {
          ...response.data!,
          stats: projectStats
        }
      };
    } catch (error: any) {
      console.error("Error fetching project with stats:", error);
      return { 
        success: false, 
        data: null, 
        error: error.message || "Failed to load project data" 
      };
    }
  },

  // Create a new project
  async createProject(projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const response = await fetchAPI<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to create project");
      } else {
        toast.success("Project created successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to create project");
      return { 
        success: false, 
        data: null, 
        error: error.message || "Failed to create project" 
      };
    }
  },

  // Update a project
  async updateProject(id: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const response = await fetchAPI<Project>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(projectData)
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to update project");
      } else {
        toast.success("Project updated successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to update project");
      return { 
        success: false, 
        data: null, 
        error: error.message || "Failed to update project" 
      };
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetchAPI<null>(`/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to delete project");
      } else {
        toast.success("Project deleted successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to delete project");
      return { 
        success: false, 
        data: null, 
        error: error.message || "Failed to delete project" 
      };
    }
  }
};

// Export other services
export const chapterService = {
  // Get chapters for a project
  async getChapters(projectId: string): Promise<ApiResponse<Chapter[]>> {
    try {
      const response = await fetchAPI<Chapter[]>(`/chapters?project_id=${projectId}`);
      return response;
    } catch (error: any) {
      console.error("Error getting chapters:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to load chapters"
      };
    }
  },
  
  // Create a new chapter
  async createChapter(chapterData: Partial<Chapter> & { project_id: string }): Promise<ApiResponse<Chapter>> {
    try {
      const response = await fetchAPI<Chapter>('/chapters', {
        method: 'POST',
        body: JSON.stringify(chapterData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error creating chapter:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to create chapter"
      };
    }
  },
  
  // Update a chapter
  async updateChapter(id: string, chapterData: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    try {
      const response = await fetchAPI<Chapter>(`/chapters/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(chapterData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error updating chapter:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to update chapter"
      };
    }
  }
};

// Re-export for convenience
export { characterService } from './api';