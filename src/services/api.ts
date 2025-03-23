// src/services/api.ts
import { toast } from "sonner";
import { Project } from "@/components/constants/projects";

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

    return data;
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

// Character service
export const characterService = {
  // Get all characters for the current user
  async getCharacters(projectId?: string) {
    try {
      const endpoint = projectId ? `/characters?project_id=${projectId}` : '/characters';
      const response = await fetchAPI(endpoint);
      
      if (!response.success) {
        toast.error(response.error || "Failed to load characters");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to load characters");
      throw error;
    }
  },

  // Create a new character
  async createCharacter(characterData: any) {
    try {
      const response = await fetchAPI('/characters', {
        method: 'POST',
        body: JSON.stringify(characterData)
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to create character");
      } else {
        toast.success("Character created successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to create character");
      throw error;
    }
  }
};

// Background service
export const backgroundService = {
  // Get all backgrounds for the current user
  async getBackgrounds(projectId?: string) {
    try {
      const endpoint = projectId ? `/backgrounds?project_id=${projectId}` : '/backgrounds';
      const response = await fetchAPI(endpoint);
      
      if (!response.success) {
        toast.error(response.error || "Failed to load backgrounds");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to load backgrounds");
      throw error;
    }
  },

  // Create a new background
  async createBackground(backgroundData: any) {
    try {
      const response = await fetchAPI('/backgrounds', {
        method: 'POST',
        body: JSON.stringify(backgroundData)
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to create background");
      } else {
        toast.success("Background created successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to create background");
      throw error;
    }
  }
};

// Chapter service
export const chapterService = {
  // Get all chapters for a project
  async getChapters(projectId: string) {
    try {
      const response = await fetchAPI(`/chapters?project_id=${projectId}`);
      
      if (!response.success) {
        toast.error(response.error || "Failed to load chapters");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to load chapters");
      throw error;
    }
  },

  // Create a new chapter
  async createChapter(chapterData: any) {
    try {
      const response = await fetchAPI('/chapters', {
        method: 'POST',
        body: JSON.stringify(chapterData)
      });
      
      if (!response.success) {
        toast.error(response.error || "Failed to create chapter");
      } else {
        toast.success("Chapter created successfully");
      }
      
      return response;
    } catch (error: any) {
      toast.error("Failed to create chapter");
      throw error;
    }
  }
};