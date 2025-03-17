// src/app/(main)/studio/projects/[projectId]/components/RecentPages.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, ArrowRight } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";

interface Page {
  id: string;
  title: string;
  updated_at: string;
  chapter_id: string;
  thumbnail_url?: string;
}

interface RecentPagesProps {
  projectId: string;
}

export default function RecentPages({ projectId }: RecentPagesProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Simulate loading pages from Supabase
    const fetchRecentPages = async () => {
      try {
        setIsLoading(true);

        // This is a placeholder - in a real app, you would fetch from your database
        // const { data, error } = await supabase
        //   .from('pages')
        //   .select('*')
        //   .eq('project_id', projectId)
        //   .order('updated_at', { ascending: false })
        //   .limit(4);

        // For demo purposes, we'll create mock data
        const mockPages: Page[] = [
          { id: '1', title: 'Introduction', updated_at: new Date(Date.now() - 3600000).toISOString(), chapter_id: 'chapter-1' },
          { id: '2', title: 'Character Introduction', updated_at: new Date(Date.now() - 86400000).toISOString(), chapter_id: 'chapter-1' },
          { id: '3', title: 'Setting the Scene', updated_at: new Date(Date.now() - 172800000).toISOString(), chapter_id: 'chapter-1' },
          { id: '4', title: 'Plot Setup', updated_at: new Date(Date.now() - 259200000).toISOString(), chapter_id: 'chapter-2' },
        ];

        // Simulate network delay
        setTimeout(() => {
          setPages(mockPages);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching recent pages:", error);
        setIsLoading(false);
      }
    };

    fetchRecentPages();
  }, [projectId]);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Pages</CardTitle>
          <CardDescription>Your most recently edited pages</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/studio/projects/${projectId}/pages`}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : pages.length > 0 ? (
          <div className="space-y-4">
            {pages.map((page) => (
              <Link 
                key={page.id} 
                href={`/studio/projects/${projectId}/chapters/${page.chapter_id}/pages/${page.id}`}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                  {page.thumbnail_url ? (
                    <img 
                      src={page.thumbnail_url} 
                      alt={page.title} 
                      className="h-full w-full object-cover rounded-md" 
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{page.title}</h4>
                  <p className="text-sm text-muted-foreground">Last edited {formatDate(page.updated_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No pages yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start creating pages for your manga project.</p>
            <Button className="mt-4" asChild>
              <Link href={`/studio/projects/${projectId}/pages/create`}>
                Create Your First Page
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}