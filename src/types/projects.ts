// src/types/projects.ts

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  created_at: string;
  updated_at: string;
  metadata?: {
    genre?: string;
    template_type?: string;
    style?: string;
    cover_image?: string;
    [key: string]: any;
  };
  // Stats and relationships can be extended here
  chapter_count?: number;
  page_count?: number;
  character_count?: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  order_index: number;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  chapter_id: string;
  title: string | null;
  order_index: number;
  layout_type: string;
  content: PageContent;
  created_at: string;
  updated_at: string;
}

export interface Panel {
  id: string;
  order: number;
  description: string;
  location: string;
  time: string;
  camera_angle: string;
  camera_shot: string;
  characters: string[];
  image_url?: string;
  generated: boolean;
}

export interface PageContent {
  panels: Panel[];
  layout: string;
  settings?: Record<string, any>;
}

export interface Character {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  metadata: CharacterMetadata;
  user_id: string;
}

export interface CharacterMetadata {
  age?: string;
  gender?: string;
  role?: string;
  personality?: string[];
  appearance?: string;
  background?: string;
  [key: string]: any;
}

export interface ProjectStats {
  chapters: number;
  pages: number;
  characters: number;
  panels: number;
  completion_percentage: number;
}

export type EditorTab = 'anime-forge' | 'characters' | 'story' | 'screenplay' | 'editor';

export interface ProjectFilters {
  status?: string;
  genre?: string;
  sort?: string;
  searchQuery?: string;
}