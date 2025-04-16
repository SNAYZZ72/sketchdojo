"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Clock, 
  Calendar, 
  ArrowRight, 
  MoreHorizontal,
  Filter,
  Star,
  ArrowUpDown,
  Trash2,
  Copy,
  PencilLine,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Project, ProjectFilters } from '@/types/projects';
import { formatDistanceToNow } from 'date-fns';
import { projectService } from '@/services/api';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Mock data (will be replaced with API data)
const mockProjects: Project[] = [
  {
    id: 'project-1',
    user_id: 'user-1',
    title: 'Midnight Samurai',
    description: 'A story of honor and betrayal in feudal Japan',
    status: 'in-progress',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      genre: 'action',
      cover_image: '/projects/cover1.jpg',
      completion_percentage: 65,
      favorite: true
    }
  },
  {
    id: 'project-2',
    user_id: 'user-1',
    title: 'Cyber Academy',
    description: 'Students with technological powers in a futuristic school',
    status: 'draft',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      genre: 'sci-fi',
      cover_image: '/projects/cover2.jpg',
      completion_percentage: 30,
      favorite: false
    }
  },
  {
    id: 'project-3',
    user_id: 'user-1',
    title: 'Dragon\'s Journey',
    description: 'A young dragon discovers his destiny in a magical world',
    status: 'completed',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      genre: 'fantasy',
      cover_image: '/projects/cover3.jpg',
      completion_percentage: 100,
      favorite: true
    }
  }
];

// Project templates
const projectTemplates = [
  {
    id: 'template-1',
    title: 'Shonen Action',
    description: 'High-energy action series with epic battles and character growth',
    cover: '/templates/shonen.jpg',
    pages: 24,
    genre: 'action'
  },
  {
    id: 'template-2',
    title: 'Romance',
    description: 'Heartfelt stories focused on relationships and emotions',
    cover: '/templates/romance.jpg',
    pages: 18,
    genre: 'romance'
  },
  {
    id: 'template-3',
    title: 'Horror',
    description: 'Suspenseful tales designed to thrill and terrify readers',
    cover: '/templates/horror.jpg',
    pages: 22,
    genre: 'horror'
  },
  {
    id: 'template-4',
    title: 'Sci-Fi',
    description: 'Futuristic settings with advanced technology and innovative concepts',
    cover: '/templates/scifi.jpg',
    pages: 20,
    genre: 'sci-fi'
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: 'all',
    genre: 'all',
    sort: 'newest',
    searchQuery: ''
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    description: '',
    genre: 'other',
    templateId: '',
  });
  const [activeTabFilter, setActiveTabFilter] = useState('all');

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { success, data, error } = await projectService.getProjects();
        if (success && data) {
          setProjects(data);
        } else {
          console.error('Error fetching projects:', error);
          // Fallback to mock data in case of error
          setProjects(mockProjects);
          toast.error('Failed to load projects from server, using demo data');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data in case of error
        setProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCreateProject = async (useTemplate = false) => {
    if (newProjectForm.title.trim() === '') {
      toast.error('Project title is required');
      return;
    }
    
    // Create a new project with form values
    const newProject: Partial<Project> = {
      title: newProjectForm.title,
      description: newProjectForm.description || 'No description provided',
      status: 'draft',
      metadata: {
        genre: newProjectForm.genre,
        completion_percentage: 0,
        cover_image: '/placeholders/project-cover.jpg',
        template_id: useTemplate ? newProjectForm.templateId : null
      }
    };
    
    setIsLoading(true);
    
    try {
      const { success, data, error } = await projectService.createProject(newProject);
      
      if (success && data) {
        toast.success('Project created successfully');
        // Add the new project to the state
        setProjects(prev => [data, ...prev]);
        // Reset form
        setNewProjectForm({
          title: '',
          description: '',
          genre: 'other',
          templateId: '',
        });
        // Close dialog
        setCreateDialogOpen(false);
        // Redirect to the project page
        window.location.href = `/studio/editor/${data.id}`;
      } else {
        console.error('Error creating project:', error);
        toast.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const { success, error } = await projectService.deleteProject(projectId);
        
        if (success) {
          toast.success('Project deleted successfully');
          // Remove the project from state
          setProjects(prev => prev.filter(p => p.id !== projectId));
        } else {
          console.error('Error deleting project:', error);
          toast.error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const toggleFavorite = async (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Update local state optimistically
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          metadata: {
            ...project.metadata,
            favorite: !project.metadata?.favorite
          }
        };
      }
      return project;
    }));
    
    try {
      // In a real app, you would update this on the server
      toast.success(`Project ${projects.find(p => p.id === projectId)?.metadata?.favorite ? 'removed from' : 'added to'} favorites`);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status');
      
      // Revert the optimistic update on error
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            metadata: {
              ...project.metadata,
              favorite: !project.metadata?.favorite
            }
          };
        }
        return project;
      }));
    }
  };

  // Filter projects based on tab and search
  const filteredProjects = projects.filter(project => {
    // Filter by tab
    if (activeTabFilter === 'favorites' && !project.metadata?.favorite) {
      return false;
    }
    if (activeTabFilter === 'drafts' && project.status !== 'draft') {
      return false;
    }
    if (activeTabFilter === 'in-progress' && project.status !== 'in-progress') {
      return false;
    }
    if (activeTabFilter === 'completed' && project.status !== 'completed') {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery && !project.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false;
    }
    
    // Filter by genre
    if (filters.genre !== 'all' && project.metadata?.genre !== filters.genre) {
      return false;
    }
    
    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (filters.sort) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'recently-updated':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-500/10">Draft</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="text-blue-500 border-blue-500 bg-blue-500/10">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10">Completed</Badge>;
      case 'published':
        return <Badge variant="outline" className="text-purple-500 border-purple-500 bg-purple-500/10">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenreBadge = (genre?: string) => {
    switch (genre) {
      case 'action':
        return <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/5">Action</Badge>;
      case 'sci-fi':
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/5">Sci-Fi</Badge>;
      case 'fantasy':
        return <Badge variant="outline" className="text-purple-500 border-purple-500/30 bg-purple-500/5">Fantasy</Badge>;
      case 'romance':
        return <Badge variant="outline" className="text-pink-500 border-pink-500/30 bg-pink-500/5">Romance</Badge>;
      case 'horror':
        return <Badge variant="outline" className="text-gray-500 border-gray-500/30 bg-gray-500/5">Horror</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500 border-gray-500/30 bg-gray-500/5">Other</Badge>;
    }
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-sketchdojo-bg-light to-sketchdojo-bg rounded-xl p-6 mb-6 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-sketchdojo-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-sketchdojo-accent/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-2">
              Your Projects
            </h1>
            <p className="text-white/60 max-w-2xl">
              Create and manage your manga projects. Start from scratch or use a template to bring your stories to life.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-md hover:shadow-lg transition-all hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" /> Create New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-sketchdojo-bg-light/95 backdrop-blur-lg border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Create New Project</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Fill in the details of your new manga project or select a template to get started quickly.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="blank" className="mt-4">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="blank">Blank Project</TabsTrigger>
                      <TabsTrigger value="template">Start from Template</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="blank" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="title" className="text-sm font-medium text-white/80">
                            Project Title <span className="text-red-400">*</span>
                          </label>
                          <Input
                            id="title"
                            placeholder="Enter project title"
                            value={newProjectForm.title}
                            onChange={(e) => setNewProjectForm({...newProjectForm, title: e.target.value})}
                            className="bg-white/10 text-white border-white/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="description" className="text-sm font-medium text-white/80">
                            Description
                          </label>
                          <textarea
                            id="description"
                            placeholder="Describe your project (optional)"
                            value={newProjectForm.description}
                            onChange={(e) => setNewProjectForm({...newProjectForm, description: e.target.value})}
                            className="w-full min-h-[100px] bg-white/10 text-white border-white/20 rounded-md p-2 resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="genre" className="text-sm font-medium text-white/80">
                            Genre
                          </label>
                          <select
                            id="genre"
                            value={newProjectForm.genre}
                            onChange={(e) => setNewProjectForm({...newProjectForm, genre: e.target.value})}
                            className="w-full bg-white/10 text-white border-white/20 rounded-md p-2"
                          >
                            <option value="action">Action</option>
                            <option value="sci-fi">Sci-Fi</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="romance">Romance</option>
                            <option value="horror">Horror</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <DialogFooter className="mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCreateDialogOpen(false)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleCreateProject(false)}
                          disabled={isLoading || !newProjectForm.title.trim()}
                          className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90"
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">⭮</span> Creating...
                            </>
                          ) : (
                            'Create Project'
                          )}
                        </Button>
                      </DialogFooter>
                    </TabsContent>
                    
                    <TabsContent value="template" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {projectTemplates.map((template) => (
                          <div 
                            key={template.id}
                            className={cn(
                              "border rounded-lg p-4 cursor-pointer transition-all",
                              newProjectForm.templateId === template.id 
                                ? "border-sketchdojo-primary bg-sketchdojo-primary/10" 
                                : "border-white/10 hover:border-white/30"
                            )}
                            onClick={() => setNewProjectForm({
                              ...newProjectForm,
                              templateId: template.id,
                              genre: template.genre
                            })}
                          >
                            <div className="aspect-video bg-gray-800 rounded-md mb-3 flex items-center justify-center text-white/30">
                              {/* Placeholder for template preview */}
                              Preview Image
                            </div>
                            <h3 className="font-medium text-white mb-1">{template.title}</h3>
                            <p className="text-xs text-white/60 mb-2 line-clamp-2">{template.description}</p>
                            <div className="flex items-center justify-between text-xs text-white/60">
                              <span>{template.pages} pages</span>
                              {getGenreBadge(template.genre)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="template-title" className="text-sm font-medium text-white/80">
                          Project Title <span className="text-red-400">*</span>
                        </label>
                        <Input
                          id="template-title"
                          placeholder="Enter project title"
                          value={newProjectForm.title}
                          onChange={(e) => setNewProjectForm({...newProjectForm, title: e.target.value})}
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      
                      <DialogFooter className="mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCreateDialogOpen(false)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleCreateProject(true)}
                          disabled={isLoading || !newProjectForm.title.trim() || !newProjectForm.templateId}
                          className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90"
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">⭮</span> Creating...
                            </>
                          ) : (
                            'Use Template'
                          )}
                        </Button>
                      </DialogFooter>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ExternalLink className="h-4 w-4 mr-2" /> Import Project
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs value={activeTabFilter} onValueChange={setActiveTabFilter} className="w-full">
            <TabsList className="bg-muted/50 overflow-x-auto flex w-full no-scrollbar">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filters.sort} onValueChange={(value) => setFilters({...filters, sort: value as any})}>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="recently-updated">Recently Updated</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-10 w-10"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-sketchdojo-accent/40 rounded-full blur-xl"></div>
              <div className="animate-spin h-12 w-12 border-4 border-sketchdojo-primary border-t-transparent rounded-full relative"></div>
            </div>
          </div>
        ) : (
          <>
            {sortedProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-sketchdojo-bg-light/50 to-transparent"
              >
                <div className="bg-sketchdojo-primary/10 rounded-full p-6 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/20 to-sketchdojo-accent/20 rounded-full blur-xl"></div>
                  <Plus className="h-10 w-10 text-sketchdojo-primary relative" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">No projects found</h3>
                <p className="text-white/60 max-w-md mb-6">
                  {filters.searchQuery 
                    ? `No projects match your search for "${filters.searchQuery}"` 
                    : "You haven't created any projects yet. Click the button below to create your first manga project."}
                </p>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 shadow-lg shadow-sketchdojo-primary/10 hover:shadow-sketchdojo-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Project
                </Button>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Link href={`/studio/editor/${project.id}`} className="block h-full">
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-b from-background/80 to-background border border-white/10 hover:border-white/20">
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Status badge */}
                          <div className="absolute bottom-3 left-3 z-10">
                            {getStatusBadge(project.status)}
                          </div>
                          
                          {/* Genre badge */}
                          <div className="absolute top-3 left-3 z-10">
                            {getGenreBadge(project.metadata?.genre)}
                          </div>
                          
                          {/* Favorite button */}
                          <div className="absolute top-3 right-3 z-10">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "h-8 w-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors",
                                      project.metadata?.favorite && "text-yellow-500"
                                    )}
                                    onClick={(e) => toggleFavorite(project.id, e)}
                                  >
                                    <Star className={cn(
                                      "h-4 w-4",
                                      project.metadata?.favorite && "fill-yellow-500"
                                    )} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {project.metadata?.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          {/* Project Actions Menu */}
                          <div className="absolute bottom-3 right-3 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="h-8 w-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-white" onClick={(e) => e.preventDefault()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                                  <PencilLine className="h-4 w-4 mr-2" /> Edit Project Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                                  <Copy className="h-4 w-4 mr-2" /> Duplicate Project
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600 cursor-pointer" 
                                  onClick={(e) => handleDeleteProject(project.id, e)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardHeader className="pb-2 pt-4">
                          <CardTitle className="text-lg group-hover:text-sketchdojo-primary transition-colors line-clamp-1">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Completion</span>
                            <span className="text-sketchdojo-primary">{project.metadata?.completion_percentage || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent rounded-full transition-all duration-1000"
                              style={{ width: `${project.metadata?.completion_percentage || 0}%` }}
                            ></div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs hover:bg-transparent hover:text-sketchdojo-primary">
                            Open <ChevronRight className="h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  custom={sortedProjects.length}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Card 
                    className="border-dashed border-white/20 h-full flex flex-col items-center justify-center p-6 hover:border-sketchdojo-primary cursor-pointer group bg-transparent hover:bg-gradient-to-br hover:from-sketchdojo-primary/5 hover:to-sketchdojo-accent/5 transition-all duration-300"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <div className="rounded-full bg-gradient-to-br from-sketchdojo-primary/10 to-sketchdojo-accent/10 p-6 mb-4 transition-all duration-300 group-hover:from-sketchdojo-primary/20 group-hover:to-sketchdojo-accent/20">
                      <Plus className="h-8 w-8 text-sketchdojo-primary/70 group-hover:text-sketchdojo-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 group-hover:text-sketchdojo-primary transition-colors">Create New Project</h3>
                    <p className="text-center text-muted-foreground text-sm mb-4">
                      Start a new manga project from scratch or using a template
                    </p>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-sketchdojo-primary/30 to-sketchdojo-accent/30 rounded-full mt-2 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
                  </Card>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Link href={`/studio/editor/${project.id}`}>
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border border-white/10 hover:border-white/20">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-24 h-20 md:h-auto bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 relative">
                            {/* Genre badge */}
                            <div className="absolute top-2 left-2">
                              {getGenreBadge(project.metadata?.genre)}
                            </div>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium group-hover:text-sketchdojo-primary transition-colors">{project.title}</h3>
                                  {project.metadata?.favorite && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(project.status)}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                                      <PencilLine className="h-4 w-4 mr-2" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={(e) => toggleFavorite(project.id, e)}>
                                      <Star className="h-4 w-4 mr-2" /> 
                                      {project.metadata?.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600 focus:text-red-600 cursor-pointer" 
                                      onClick={(e) => handleDeleteProject(project.id, e)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                <span>Completion</span>
                                <span className="text-sketchdojo-primary">{project.metadata?.completion_percentage || 0}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent rounded-full transition-all duration-1000"
                                  style={{ width: `${project.metadata?.completion_percentage || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1 hover:bg-transparent hover:text-sketchdojo-primary">
                                Open <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  custom={sortedProjects.length}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Card 
                    className="border-dashed border-white/20 hover:border-sketchdojo-primary cursor-pointer hover:bg-gradient-to-br hover:from-sketchdojo-primary/5 hover:to-sketchdojo-accent/5 transition-all duration-300"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <div className="flex items-center p-6">
                      <div className="rounded-full bg-gradient-to-br from-sketchdojo-primary/10 to-sketchdojo-accent/10 p-4 mr-4">
                        <Plus className="h-6 w-6 text-sketchdojo-primary/70" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Create New Project</h3>
                        <p className="text-muted-foreground text-sm">
                          Start a new manga project from scratch or using a template
                        </p>
                      </div>
                      <ArrowRight className="ml-auto h-5 w-5 text-sketchdojo-primary/70" />
                    </div>
                  </Card>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}