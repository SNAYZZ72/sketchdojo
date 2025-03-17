// src/components/constants/projects.ts

// Project creation steps
export const projectCreationSteps = [
    { id: 'details', title: 'Project Details' },
    { id: 'template', title: 'Choose Template' },
    { id: 'preview', title: 'Preview & Create' },
  ];
  
  // Genre options
  export const genreOptions = [
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'slice-of-life', label: 'Slice of Life' },
    { value: 'sports', label: 'Sports' },
    { value: 'supernatural', label: 'Supernatural' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'other', label: 'Other' },
  ];
  
  // Project status options
  export const projectStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];
  
  // Project sort options
  export const projectSortOptions = [
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
  ];
  
  // Template type options
  export const templateTypeOptions = [
    { 
      value: 'blank', 
      label: 'Blank Canvas',
      description: 'Start from scratch with an empty project',
      icon: 'Plus'
    },
    { 
      value: 'basic', 
      label: 'Basic Layouts',
      description: 'Simple page layouts to build upon',
      icon: 'Layers'
    },
    { 
      value: 'detailed', 
      label: 'Detailed Templates',
      description: 'Full story templates with structure',
      icon: 'BookOpen'
    },
    { 
      value: 'custom', 
      label: 'My Templates',
      description: 'Templates you\'ve saved for reuse',
      icon: 'Bookmark'
    },
  ];
  
  // Mock templates (would come from database)
  export const mockTemplates = [
    { 
      id: 'template-1', 
      name: 'Shonen Adventure', 
      description: 'Action-packed template for adventure stories', 
      tags: ['Action', 'Adventure'], 
      pages: 24, 
      image: '/templates/shonen.jpg',
      type: 'detailed',
    },
    { 
      id: 'template-2', 
      name: 'Romance', 
      description: 'Perfect for love stories and drama', 
      tags: ['Romance', 'Drama'], 
      pages: 18, 
      image: '/templates/romance.jpg',
      type: 'detailed',
    },
    { 
      id: 'template-3', 
      name: 'Horror', 
      description: 'Create suspenseful and scary manga', 
      tags: ['Horror', 'Thriller'], 
      pages: 22, 
      image: '/templates/horror.jpg',
      type: 'detailed',
    },
    { 
      id: 'template-4', 
      name: 'Basic Three-Panel', 
      description: 'Simple three-panel page layout', 
      tags: ['Basic', 'Simple'], 
      pages: 6, 
      image: '/templates/basic.jpg',
      type: 'basic',
    },
    { 
      id: 'template-5', 
      name: 'Five-Panel Action', 
      description: 'Dynamic five-panel layout for action sequences', 
      tags: ['Action', 'Dynamic'], 
      pages: 8, 
      image: '/templates/action.jpg',
      type: 'basic',
    },
  ];
  
  // Project interface
  export interface Project {
    id: string;
    title: string;
    description: string | null;
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

  export interface ProjectMetadata {
    genre: string;
    template_type: string;
    template_id: string | null;
    target_audience?: string;
    estimated_pages?: number;
    publication_schedule?: string;
    cover_image?: string;
    progress?: number;
  }
  
  export const targetAudienceOptions = [
    { value: 'all_ages', label: 'All Ages' },
    { value: 'children', label: 'Children (8-12)' },
    { value: 'teens', label: 'Teens (13-17)' },
    { value: 'young_adults', label: 'Young Adults (18-24)' },
    { value: 'adults', label: 'Adults (25+)' },
  ];
  
  export const publicationScheduleOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'oneshot', label: 'One-shot' },
  ];