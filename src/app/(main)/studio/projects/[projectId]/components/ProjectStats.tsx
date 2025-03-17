// src/app/(main)/studio/projects/[projectId]/components/ProjectStats.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ProjectStatsProps {
  project: Project;
}

export default function ProjectStats({ project }: ProjectStatsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Project Stats</CardTitle>
        <CardDescription>Key metrics for your project</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Progress</h3>
          <p className="text-2xl font-bold">{project.metadata.progress || 0}%</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Status</h3>
          <p className="text-2xl font-bold capitalize">{project.status}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Genre</h3>
          <p className="text-2xl font-bold capitalize">{project.metadata.genre}</p>
        </div>
      </CardContent>
    </Card>
  );
}