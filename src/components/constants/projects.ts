// src/components/constants/projects.ts
import { ProjectGenre, ArtStyle, ProjectStatus } from '@/types/projects';

/**
 * Genre options with labels for selection
 */
export const genreOptions: { value: ProjectGenre; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Science Fiction' },
  { value: 'slice-of-life', label: 'Slice of Life' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'historical', label: 'Historical' },
  { value: 'mecha', label: 'Mecha' },
  { value: 'psychological', label: 'Psychological' },
  { value: 'other', label: 'Other' }
];

/**
 * Art style options with labels for selection
 */
export const artStyleOptions: { value: ArtStyle; label: string }[] = [
  { value: 'anime-forge', label: 'Anime Forge' },
  { value: 'studio-ghibli', label: 'Studio Ghibli' },
  { value: 'modern-manga', label: 'Modern Manga' },
  { value: 'classic-anime', label: 'Classic Anime' },
  { value: 'shoujo', label: 'Shoujo' },
  { value: 'shounen', label: 'Shounen' },
  { value: 'seinen', label: 'Seinen' },
  { value: 'josei', label: 'Josei' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'chibi', label: 'Chibi' },
  { value: 'custom', label: 'Custom' }
];

/**
 * Project status options with labels and colors
 */
export const projectStatusOptions: { 
  value: ProjectStatus; 
  label: string; 
  color: string;
  bgColor: string;
}[] = [
  { 
    value: 'draft', 
    label: 'Draft', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/10' 
  },
  { 
    value: 'in-progress', 
    label: 'In Progress', 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-400/10' 
  },
  { 
    value: 'completed', 
    label: 'Completed', 
    color: 'text-green-400', 
    bgColor: 'bg-green-400/10' 
  },
  { 
    value: 'archived', 
    label: 'Archived', 
    color: 'text-gray-400', 
    bgColor: 'bg-gray-400/10' 
  }
];

/**
 * Project sort options
 */
export const projectSortOptions = [
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'created_at', label: 'Date Created' },
  { value: 'title', label: 'Title' },
  { value: 'progress', label: 'Progress' }
];

/**
 * Demo template projects
 */
export const templateProjects = [
  {
    id: 'template-1',
    title: 'Shonen Adventure',
    description: 'A young hero embarks on a journey to become the strongest in the world.',
    genre: 'adventure',
    artStyle: 'shounen',
    coverImageUrl: '/templates/shonen-adventure.jpg'
  },
  {
    id: 'template-2',
    title: 'High School Romance',
    description: 'Two students from different worlds find love in an unexpected place.',
    genre: 'romance',
    artStyle: 'shoujo',
    coverImageUrl: '/templates/high-school-romance.jpg'
  },
  {
    id: 'template-3',
    title: 'Mystery Detective',
    description: 'A brilliant detective solves supernatural cases in a modern city.',
    genre: 'mystery',
    artStyle: 'seinen',
    coverImageUrl: '/templates/mystery-detective.jpg'
  },
  {
    id: 'template-4',
    title: 'Fantasy Kingdom',
    description: 'Magic and adventure in a world of dragons, knights, and wizards.',
    genre: 'fantasy',
    artStyle: 'classic-anime',
    coverImageUrl: '/templates/fantasy-kingdom.jpg'
  }
];