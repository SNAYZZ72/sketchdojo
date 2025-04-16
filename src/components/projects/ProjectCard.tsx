"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Book, Users, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { projectStatusOptions } from '@/components/constants/projects';
import { Project, ProjectWithStats } from '@/types/projects';
import { projectService } from '@/services/project-service';

// Function to get status badge styles
const getStatusBadge = (status: string) => {
  const statusOption = projectStatusOptions.find(option => option.value === status);
  return statusOption || projectStatusOptions[0]; // Default to draft if not found
};

export interface ProjectCardProps {
  project: Project | ProjectWithStats;
  onProjectUpdated?: () => void;
  onProjectDeleted?: () => void;
  variant?: 'default' | 'compact';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onProjectUpdated, 
  onProjectDeleted,
  variant = 'default'
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Detect if project is a ProjectWithStats
  const hasStats = 'chaptersCount' in project;
  
  // Extract cover image URL from metadata
  const coverImageUrl = project.metadata?.coverImageUrl || '/placeholders/project-cover.jpg';
  
  // Progress percentage
  const progress = project.metadata?.progress || 0;
  
  // Format date for display
  const updatedAtText = formatDistanceToNow(new Date(project.updated_at), { addSuffix: true });
  
  // Handle project deletion
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    
    try {
      const deleted = await projectService.deleteProject(project.id);
      
      if (deleted) {
        // Call the onProjectDeleted callback if provided
        if (onProjectDeleted) {
          onProjectDeleted();
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  // Get status badge from status
  const statusBadge = getStatusBadge(project.status);
  
  if (variant === 'compact') {
    return (
      <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer" 
        onClick={() => router.push(`/studio/projects/${project.id}`)}>
        <div className="relative h-12 w-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
          <Image 
            src={coverImageUrl} 
            alt={project.title} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{project.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${statusBadge.color}`}>
              {statusBadge.label}
            </Badge>
            <span className="text-xs text-muted-foreground">Updated {updatedAtText}</span>
          </div>
        </div>
        <div className="ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/studio/projects/${project.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image 
            src={coverImageUrl} 
            alt={project.title} 
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
            priority={false}
            fill
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${statusBadge.bgColor} ${statusBadge.color}`}>
              {statusBadge.label}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-start">
            <Link href={`/studio/projects/${project.id}`} className="hover:text-primary text-lg font-semibold transition-colors">
              {project.title}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/studio/projects/${project.id}`}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/studio/projects/${project.id}/chapters`}>
                    <Book className="h-4 w-4 mr-2" /> Manage Chapters
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
          
          {hasStats && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-1" />
                <span>{(project as ProjectWithStats).chaptersCount} chapters</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{(project as ProjectWithStats).charactersCount} characters</span>
              </div>
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span>{(project as ProjectWithStats).backgroundsCount} backgrounds</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-6">
          <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
            <span>Updated {updatedAtText}</span>
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Link href={`/studio/projects/${project.id}`}>
                Continue
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project &quot;{project.title}&quot; and all associated data. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;