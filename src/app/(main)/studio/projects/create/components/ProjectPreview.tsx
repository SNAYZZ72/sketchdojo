// src/app/(main)/studio/projects/create/components/ProjectPreview.tsx

import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockTemplates } from '@/components/constants/projects';

// Define interface for the component props
interface ProjectPreviewProps {
  projectData: {
    title: string;
    description?: string;
    genre: string;
    templateType: string;
    templateId?: string;
    targetAudience?: string;
    estimatedLength?: number;
    tags?: string[];
  };
  onBack: () => void;
  onCreate: () => void;
  isCreating: boolean;
}

export function ProjectPreview({ projectData, onBack, onCreate, isCreating }: ProjectPreviewProps) {
  const selectedTemplate = projectData.templateId ? mockTemplates.find((t) => t.id === projectData.templateId) : null;

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="p-6 bg-card">
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{projectData.title}</h3>
              {projectData.description && (
                <p className="text-muted-foreground mt-2">{projectData.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Project Details */}
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="p-6 bg-card">
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Genre</p>
              <p className="font-medium">{projectData.genre}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template Type</p>
              <p className="font-medium">{projectData.templateType}</p>
            </div>
            {projectData.targetAudience && (
              <div>
                <p className="text-sm text-muted-foreground">Target Audience</p>
                <p className="font-medium">{projectData.targetAudience}</p>
              </div>
            )}
            {projectData.estimatedLength && (
              <div>
                <p className="text-sm text-muted-foreground">Estimated Length</p>
                <p className="font-medium">{projectData.estimatedLength} pages</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Template */}
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="p-6 bg-card">
          <CardTitle>Template</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {selectedTemplate ? (
            <div className="flex flex-col items-center space-y-4">
              <Button variant="ghost" className="h-auto p-0 flex flex-col">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">{selectedTemplate.name}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {selectedTemplate.pages} pages • {selectedTemplate.tags.join(', ')}
                </span>
              </Button>
            </div>
          ) : (
            <p>Blank project (no template selected)</p>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onCreate} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}