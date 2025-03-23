// src/app/(main)/studio/projects/[projectId]/components/ProjectStructure.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, Tag, LayoutGrid } from 'lucide-react';

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
    target_audience?: string;
    estimated_pages?: number;
    tags?: string[];
  };
}

interface ProjectStructureProps {
  project: Project;
}

export default function ProjectStructure({ project }: ProjectStructureProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Info</CardTitle>
        <CardDescription>Details about your manga project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Book className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Genre</p>
            <p className="text-sm text-muted-foreground capitalize">{project.metadata.genre}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Template Type</p>
            <p className="text-sm text-muted-foreground capitalize">
              {project.metadata.template_type ? project.metadata.template_type.replace('_', ' ') : 'Not specified'}
            </p>
          </div>
        </div>

        {project.metadata.target_audience && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Target Audience</p>
              <p className="text-sm text-muted-foreground">{project.metadata.target_audience}</p>
            </div>
          </div>
        )}

        {project.metadata.tags && project.metadata.tags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {project.metadata.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {project.metadata.estimated_pages && (
          <div className="mt-4">
            <p className="text-sm font-medium">Estimated Length</p>
            <p className="text-sm text-muted-foreground">{project.metadata.estimated_pages} pages</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}