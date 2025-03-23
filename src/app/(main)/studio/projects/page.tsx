"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/global/protected-route';
import { projectService } from '@/services/api';
import { motion } from 'framer-motion';

// Constants
import { 
  projectStatusOptions, 
  projectSortOptions,
  Project 
} from '@/components/constants/projects';

// Icons
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Copy, 
  Image as ImageIcon,
  Layers,
  Clock,
  X
} from 'lucide-react';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();
  
  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Apply filters when search, status or sort changes
  useEffect(() => {
    filterProjects();
  }, [searchQuery, statusFilter, sortBy, projects]);
  
  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      const { data, error } = await projectService.getProjects();
      
      if (error) throw error;
      
      // Process data
      const formattedProjects = data?.map((project: any) => ({
        ...project,
        metadata: project.metadata || {},
      })) || [];
      
      setProjects(formattedProjects);
      setFilteredProjects(formattedProjects);
      
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsError(true);
      toast.error("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter and sort projects
  const filterProjects = () => {
    if (!projects.length) return;
    
    let filtered = [...projects];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
    
    setFilteredProjects(filtered);
  };
  
  // Delete project
  const deleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await projectService.deleteProject(projectToDelete);
      
      // Update projects list
      setProjects(projects.filter(p => p.id !== projectToDelete));
      toast.success("Project deleted successfully");
      
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setProjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle retry
  const handleRetry = () => {
    fetchProjects();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 2592000) {
      const days = Math.floor(diffSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Draft</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <Card key={i} className="overflow-hidden group border border-gray-200 dark:border-white/10">
        <div className="relative h-40 w-full bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader className="pb-2 px-5 pt-5">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="px-5">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-2 w-full mb-2" />
        </CardContent>
        <CardFooter className="flex justify-between px-5 pb-5">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </CardFooter>
      </Card>
    ));
  };

  // Render error state
  const renderError = () => (
    <Card className="border-dashed border-2 border-destructive/50">
      <CardContent className="py-12 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mb-4">
          <X className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-medium mb-2">Failed to load projects</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          There was an error loading your projects. Please try again.
        </p>
        <Button onClick={handleRetry} variant="default">Try Again</Button>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRoute>
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your manga projects</p>
          </div>
          
          <Button 
            onClick={() => router.push('/studio/projects/create')} 
            className="md:w-auto w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>
        
        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-white dark:bg-white/5 border-gray-300 dark:border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-col sm:flex-row">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-white/5 border-gray-300 dark:border-white/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
                {projectStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-white/5 border-gray-300 dark:border-white/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
                {projectSortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Projects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : isError ? (
          <div className="grid grid-cols-1 gap-6">
            {renderError()}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group hover:shadow-md transition-all border border-gray-200 dark:border-white/10">
                <div className="relative h-40 w-full bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  
                  {/* Project cover image would go here */}
                  {/* {project.metadata.cover_image && (
                    <Image src={project.metadata.cover_image} alt={project.title} fill className="object-cover" />
                  )} */}
                  
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(project.status)}
                  </div>
                  
                  {/* Project actions */}
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-gray-200 dark:border-white/20 bg-white dark:bg-background/90">
                        <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/studio/projects/${project.id}`)}
                          className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => {
                            setProjectToDelete(project.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="p-5">
                  <Link href={`/studio/projects/${project.id}`} className="hover:underline block">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                  </Link>
                  
                  {project.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2 min-h-[40px]">
                      {project.description}
                    </p>
                  )}
                  
                  {project.metadata.progress !== undefined && (
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-white/60">Progress</span>
                        <span className="text-primary">{project.metadata.progress}%</span>
                      </div>
                      <Progress value={project.metadata.progress} className="h-1" />
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-xs text-gray-600 dark:text-white/60">
                    <div className="flex items-center">
                      <Layers className="h-3 w-3 mr-1" />
                      <span className="capitalize">
                        {project.metadata.genre || "No genre"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{getRelativeTime(project.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Create new project card */}
            <Card className="overflow-hidden border-dashed border-2 border-gray-200 dark:border-white/10 group hover:border-primary/50 transition-all">
              <CardContent className="h-full flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-center text-gray-900 dark:text-white">Create New Project</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  Start from scratch or use a template
                </p>
                <Button 
                  onClick={() => router.push('/studio/projects/create')}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  New Project
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 dark:border-white/10">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mb-4">
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">No projects yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? "No projects match your current filters. Try adjusting your search or filters."
                  : "Start creating your first manga project and it will appear here."}
              </p>
              <Button 
                onClick={() => router.push('/studio/projects/create')}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                project and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={deleteProject}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}