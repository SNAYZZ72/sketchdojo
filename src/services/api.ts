// src/services/api.ts
import { toast } from "sonner";

// Base API fetch function with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = `Request failed with status ${response.status}`;
      console.error(`API Error (${endpoint}):`, new Error(errorMessage));
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Project service
export const projectService = {
  // Get all projects for the current user
  async getProjects() {
    try {
      return await fetchAPI('/projects');
    } catch (error) {
      toast.error("Failed to load projects");
      throw error;
    }
  },

  // Get project by ID
  async getProject(id: string) {
    try {
      return await fetchAPI(`/projects/${id}`);
    } catch (error) {
      toast.error("Failed to load project");
      throw error;
    }
  },

  // Create a new project
  async createProject(projectData: any) {
    try {
      return await fetchAPI('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
    } catch (error) {
      toast.error("Failed to create project");
      throw error;
    }
  },

  // Update a project
  async updateProject(id: string, projectData: any) {
    try {
      return await fetchAPI(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(projectData)
      });
    } catch (error) {
      toast.error("Failed to update project");
      throw error;
    }
  },

  // Delete a project
  async deleteProject(id: string) {
    try {
      return await fetchAPI(`/projects/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      toast.error("Failed to delete project");
      throw error;
    }
  }
};

// Character service
export const characterService = {
  // Get all characters for the current user
  async getCharacters(projectId?: string) {
    try {
      const endpoint = projectId ? `/characters?project_id=${projectId}` : '/characters';
      return await fetchAPI(endpoint);
    } catch (error) {
      toast.error("Failed to load characters");
      throw error;
    }
  },

  // Create a new character
  async createCharacter(characterData: any) {
    try {
      return await fetchAPI('/characters', {
        method: 'POST',
        body: JSON.stringify(characterData)
      });
    } catch (error) {
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
      return await fetchAPI(endpoint);
    } catch (error) {
      toast.error("Failed to load backgrounds");
      throw error;
    }
  },

  // Create a new background
  async createBackground(backgroundData: any) {
    try {
      return await fetchAPI('/backgrounds', {
        method: 'POST',
        body: JSON.stringify(backgroundData)
      });
    } catch (error) {
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
      return await fetchAPI(`/chapters?project_id=${projectId}`);
    } catch (error) {
      toast.error("Failed to load chapters");
      throw error;
    }
  },

  // Create a new chapter
  async createChapter(chapterData: any) {
    try {
      return await fetchAPI('/chapters', {
        method: 'POST',
        body: JSON.stringify(chapterData)
      });
    } catch (error) {
      toast.error("Failed to create chapter");
      throw error;
    }
  }
};