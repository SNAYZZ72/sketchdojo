// src/services/api.ts
import { toast } from "sonner";

const API_BASE_URL = '/api';

// Common fetch wrapper with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    toast.error(error.message || "An unexpected error occurred");
    throw error;
  }
}

// Project APIs
export const projectService = {
  // Create a new project
  createProject: async (projectData: any) => {
    return fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Get all projects for the current user
  getProjects: async () => {
    return fetchAPI('/projects');
  },

  // Get a single project by ID
  getProject: async (projectId: string) => {
    return fetchAPI(`/projects/${projectId}`);
  },

  // Update a project
  updateProject: async (projectId: string, projectData: any) => {
    return fetchAPI(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    });
  },

  // Delete a project
  deleteProject: async (projectId: string) => {
    return fetchAPI(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

// Chapter APIs
export const chapterService = {
  // Create a new chapter
  createChapter: async (chapterData: any) => {
    return fetchAPI('/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  // Get chapters for a project
  getChapters: async (projectId: string) => {
    return fetchAPI(`/chapters?project_id=${projectId}`);
  },

  // Update a chapter
  updateChapter: async (chapterId: string, chapterData: any) => {
    return fetchAPI(`/chapters/${chapterId}`, {
      method: 'PATCH',
      body: JSON.stringify(chapterData),
    });
  },

  // Delete a chapter
  deleteChapter: async (chapterId: string) => {
    return fetchAPI(`/chapters/${chapterId}`, {
      method: 'DELETE',
    });
  },
};

// Character APIs
export const characterService = {
  // Create a new character
  createCharacter: async (characterData: any) => {
    return fetchAPI('/characters', {
      method: 'POST',
      body: JSON.stringify(characterData),
    });
  },

  // Get characters (optionally filtered by project)
  getCharacters: async (projectId?: string) => {
    const endpoint = projectId ? `/characters?project_id=${projectId}` : '/characters';
    return fetchAPI(endpoint);
  },
};

// Background APIs
export const backgroundService = {
  // Create a new background
  createBackground: async (backgroundData: any) => {
    return fetchAPI('/backgrounds', {
      method: 'POST',
      body: JSON.stringify(backgroundData),
    });
  },

  // Get backgrounds (optionally filtered by project)
  getBackgrounds: async (projectId?: string) => {
    const endpoint = projectId ? `/backgrounds?project_id=${projectId}` : '/backgrounds';
    return fetchAPI(endpoint);
  },
};