// src/app/(main)/studio/projects/[projectId]/components/ChapterOverview.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight, BookOpen } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: 'draft' | 'in_progress' | 'completed';
  page_count: number;
  completed_pages: number;
}

interface ChapterOverviewProps {
  projectId: string;
}

export default function ChapterOverview({ projectId }: ChapterOverviewProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Simulate loading chapters from Supabase
    const fetchChapters = async () => {
      try {
        setIsLoading(true);

        // This is a placeholder - in a real app, you would fetch from your database
        // const { data, error } = await supabase
        //   .from('chapters')
        //   .select('*')
        //   .eq('project_id', projectId)
        //   .order('order_index', { ascending: true });

        // For demo purposes, we'll create mock data
        const mockChapters: Chapter[] = [
          { id: 'chapter-1', title: 'Chapter 1: Beginnings', description: 'Introduction to the world and characters', order_index: 0, status: 'completed', page_count: 12, completed_pages: 12 },
          { id: 'chapter-2', title: 'Chapter 2: The Journey', description: 'The heroes embark on their adventure', order_index: 1, status: 'in_progress', page_count: 15, completed_pages: 8 },
          { id: 'chapter-3', title: 'Chapter 3: First Conflict', description: 'Challenges arise for our protagonists', order_index: 2, status: 'draft', page_count: 18, completed_pages: 3 },
        ];

        // Simulate network delay
        setTimeout(() => {
          setChapters(mockChapters);
          setIsLoading(false);
        }, 600);

      } catch (error) {
        console.error("Error fetching chapters:", error);
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, [projectId]);

  // Helper to get badge color based on status
  const getStatusBadge = (status: Chapter['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-yellow-500 bg-yellow-500/10 border-yellow-500/30">Draft</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-500 bg-blue-500/10 border-blue-500/30">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/30">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Chapters</CardTitle>
          <CardDescription>Organize your manga into chapters</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/studio/projects/${projectId}/chapters`}>
            All Chapters <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : chapters.length > 0 ? (
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <Link 
                key={chapter.id}
                href={`/studio/projects/${projectId}/chapters/${chapter.id}`}
                className="block p-4 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{chapter.title}</h3>
                  {getStatusBadge(chapter.status)}
                </div>
                {chapter.description && (
                  <p className="text-sm text-muted-foreground mb-2">{chapter.description}</p>
                )}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((chapter.completed_pages / chapter.page_count) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(chapter.completed_pages / chapter.page_count) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {chapter.completed_pages} of {chapter.page_count} pages completed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No chapters yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start organizing your manga into chapters.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/studio/projects/${projectId}/chapters/create`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Chapter
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}