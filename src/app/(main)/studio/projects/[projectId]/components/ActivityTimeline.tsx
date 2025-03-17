// src/app/(main)/studio/projects/[projectId]/components/ActivityTimeline.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileEdit, Plus, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";

interface Activity {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'update' | 'invite';
  entityType: 'page' | 'chapter' | 'character' | 'background' | 'project';
  entityName: string;
  timestamp: string;
  userId: string;
  userName: string;
}

interface ActivityTimelineProps {
  projectId: string;
}

export default function ActivityTimeline({ projectId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Simulate loading activities from Supabase
    const fetchActivities = async () => {
      try {
        setIsLoading(true);

        // This is a placeholder - in a real app, you would fetch from your database
        // const { data, error } = await supabase
        //   .from('project_activities')
        //   .select('*')
        //   .eq('project_id', projectId)
        //   .order('timestamp', { ascending: false })
        //   .limit(10);

        // For demo purposes, we'll create mock data
        const mockActivities: Activity[] = [
          { id: '1', type: 'create', entityType: 'page', entityName: 'Introduction', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 'user1', userName: 'You' },
          { id: '2', type: 'edit', entityType: 'page', entityName: 'Character Introduction', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: 'user1', userName: 'You' },
          { id: '3', type: 'create', entityType: 'character', entityName: 'Main Hero', timestamp: new Date(Date.now() - 172800000).toISOString(), userId: 'user1', userName: 'You' },
          { id: '4', type: 'update', entityType: 'project', entityName: 'Project Settings', timestamp: new Date(Date.now() - 259200000).toISOString(), userId: 'user1', userName: 'You' },
          { id: '5', type: 'create', entityType: 'chapter', entityName: 'Chapter 1', timestamp: new Date(Date.now() - 345600000).toISOString(), userId: 'user1', userName: 'You' },
        ];

        // Simulate network delay
        setTimeout(() => {
          setActivities(mockActivities);
          setIsLoading(false);
        }, 700);

      } catch (error) {
        console.error("Error fetching project activities:", error);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [projectId]);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Get activity icon based on activity type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'edit':
        return <FileEdit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'update':
        return <RefreshCw className="h-4 w-4" />;
      case 'invite':
        return <UserPlus className="h-4 w-4" />;
      default:
        return <FileEdit className="h-4 w-4" />;
    }
  };

  // Get activity message based on activity type
  const getActivityMessage = (activity: Activity) => {
    const { type, entityType, entityName, userName } = activity;
    
    switch (type) {
      case 'create':
        return `${userName} created ${entityType} "${entityName}"`;
      case 'edit':
        return `${userName} edited ${entityType} "${entityName}"`;
      case 'delete':
        return `${userName} deleted ${entityType} "${entityName}"`;
      case 'update':
        return `${userName} updated ${entityType} "${entityName}"`;
      case 'invite':
        return `${userName} invited user to this project`;
      default:
        return `${userName} performed action on ${entityType} "${entityName}"`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Recent actions in this project</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm">{getActivityMessage(activity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}