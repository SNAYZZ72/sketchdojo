// src/app/(main)/studio/projects/[projectId]/components/QuickActions.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Settings, 
  Share2, 
  FileEdit, 
  Trash2, 
  Download, 
  MoreVertical,
  BookOpen,
  Users,
  ImageIcon, 
  FileText
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
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

interface QuickActionsProps {
  project: Project;
}

export default function QuickActions({ project }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" asChild>
        <Link href={`/studio/projects/${project.id}/chapters/create`}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Chapter
        </Link>
      </Button>

      <Button size="sm" variant="outline" asChild>
        <Link href={`/studio/projects/${project.id}/editor`}>
          <FileEdit className="h-4 w-4 mr-2" />
          Open Editor
        </Link>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/studio/projects/${project.id}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              Project Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/studio/projects/${project.id}/characters`}>
              <Users className="h-4 w-4 mr-2" />
              Characters
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/studio/projects/${project.id}/backgrounds`}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Backgrounds
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/studio/projects/${project.id}/storyboard`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Storyboard
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <Share2 className="h-4 w-4 mr-2" />
            Share Project
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Export
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <FileText className="h-4 w-4 mr-2" />
            View Notes
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}