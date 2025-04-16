// Sample project data for the projects showcase
// In a real application, this would be fetched from an API

export interface Project {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    lastEdited: string;
    href: string;
    featured?: boolean;
    type?: 'manga' | 'comic' | 'story' | 'character';
  }
  
  export const SAMPLE_PROJECTS: Project[] = [
    {
      id: 'prompt-to-manga-studio',
      title: 'Prompt-to-Manga Studio',
      description: 'A text-to-manga generator that creates manga panels from your descriptions',
      imageUrl: '/projects/prompt-to-manga.jpg',
      lastEdited: 'about 15 hours ago',
      href: '/studio/projects/prompt-to-manga-studio',
      featured: true,
      type: 'manga'
    },
    {
      id: 'ai-manga-canvas',
      title: 'AI Manga Canvas',
      description: 'Interactive canvas for designing manga panels with AI assistance',
      imageUrl: '/projects/ai-manga-canvas.jpg',
      lastEdited: '2 days ago',
      href: '/studio/projects/ai-manga-canvas',
      type: 'manga'
    },
    {
      id: 'inkflow-ai-studio',
      title: 'InkFlow AI Studio',
      description: 'Advanced inking and styling tool for manga artists',
      imageUrl: '/projects/inkflow-ai-studio.jpg',
      lastEdited: '2 days ago',
      href: '/studio/projects/inkflow-ai-studio',
      featured: true,
      type: 'manga'
    },
    {
      id: 'dojo-comic-scribe',
      title: 'Dojo Comic Scribe',
      description: 'AI-powered dialog and narrative generator for comics',
      imageUrl: '/projects/dojo-comic-scribe.jpg',
      lastEdited: '2 days ago',
      href: '/studio/projects/dojo-comic-scribe',
      type: 'comic'
    },
    {
      id: 'manga-ai-canvas',
      title: 'Manga AI Canvas',
      description: 'Collaborative canvas for manga creation with AI enhancements',
      imageUrl: '/projects/manga-ai-canvas.jpg',
      lastEdited: '2 days ago',
      href: '/studio/projects/manga-ai-canvas',
      featured: true,
      type: 'manga'
    },
    {
      id: 'manga-narrative-lab',
      title: 'Manga Narrative Lab',
      description: 'Story development tool for manga writers with AI suggestions',
      imageUrl: '/projects/manga-narrative-lab.jpg',
      lastEdited: '4 days ago',
      href: '/studio/projects/manga-narrative-lab',
      type: 'story'
    },
    {
      id: 'anime-story-forge',
      title: 'Anime Story Forge',
      description: 'Character and plot development tool for anime narratives',
      imageUrl: '/projects/anime-story-forge.jpg',
      lastEdited: '5 days ago',
      href: '/studio/projects/anime-story-forge',
      featured: true,
      type: 'story'
    },
    {
      id: 'manga-sketch-forge',
      title: 'Manga Sketch Forge',
      description: 'Quick sketching tool for manga artists with style transfer',
      imageUrl: '/projects/manga-sketch-forge.jpg',
      lastEdited: '9 days ago',
      href: '/studio/projects/manga-sketch-forge',
      type: 'manga'
    },
    {
      id: 'sketch-dojo-genesis',
      title: 'Sketch Dojo Genesis',
      description: 'Foundation tool for creating manga universes and worldbuilding',
      imageUrl: '/projects/sketch-dojo-genesis.jpg',
      lastEdited: '9 days ago',
      href: '/studio/projects/sketch-dojo-genesis',
      type: 'manga'
    },
    {
      id: 'sketchdojo-ai',
      title: 'SketchDojo AI',
      description: 'Core AI platform for manga creation and enhancement',
      imageUrl: '/projects/sketchdojo-ai.jpg',
      lastEdited: 'about 1 month ago',
      href: '/studio/projects/sketchdojo-ai',
      featured: true,
      type: 'manga'
    },
    {
      id: 'character-creator-carousel',
      title: 'Character Creator Carousel',
      description: 'Multi-view character design tool with consistent style',
      imageUrl: '/projects/character-creator-carousel.jpg',
      lastEdited: 'about 2 months ago',
      href: '/studio/projects/character-creator-carousel',
      type: 'character'
    },
    {
      id: 'figma-landing-sharing',
      title: 'Figma Landing Sharing',
      description: 'Design and share manga project landing pages easily',
      imageUrl: '/projects/figma-landing-sharing.jpg',
      lastEdited: 'about 4 months ago',
      href: '/studio/projects/figma-landing-sharing',
      type: 'manga'
    }
  ];