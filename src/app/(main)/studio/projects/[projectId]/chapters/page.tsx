// src/app/(main)/studio/projects/[projectId]/chapters/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { 
  Plus, 
  Loader2, 
  BookOpen, 
  GripVertical, 
  MoreVertical, 
  FileText, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import or create this component
import ChapterForm from './components/ChapterForm';

// Interface for Chapter
interface Chapter {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  order_index: number;
  status: 'draft' | 'in_progress' | 'completed';
}

// Helper function to get badge variant based on status
const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'in_progress':
      return 'default';
    case 'completed':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function ChapterManagement() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('project_id', params.projectId)
          .order('order_index');
        
        if (error) {
          throw error;
        }
        
        setChapters(data || []);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        toast.error("Failed to load chapters");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapters();
  }, [params.projectId, supabase]);
  
  // DnD handlers for reordering chapters
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Find the indices for the drag source and destination
      const oldIndex = chapters.findIndex(chapter => chapter.id === active.id);
      const newIndex = chapters.findIndex(chapter => chapter.id === over.id);
      
      // Reorder the chapters array
      const updatedChapters = [...chapters];
      const [movedChapter] = updatedChapters.splice(oldIndex, 1);
      updatedChapters.splice(newIndex, 0, movedChapter);
      
      // Update the order_index values
      const reorderedChapters = updatedChapters.map((chapter, index) => ({
        ...chapter,
        order_index: index
      }));
      
      // Optimistically update the UI
      setChapters(reorderedChapters);
      
      // Update the database
      try {
        // For each chapter that changed position, update its order_index
        for (const chapter of reorderedChapters) {
          const originalChapter = chapters.find(c => c.id === chapter.id);
          if (originalChapter && chapter.order_index !== originalChapter.order_index) {
            await supabase
              .from('chapters')
              .update({ order_index: chapter.order_index })
              .eq('id', chapter.id);
          }
        }
      } catch (error) {
        console.error("Error updating chapter order:", error);
        toast.error("Failed to update chapter order");
        // Revert back to original order if there was an error
        setChapters(chapters);
      }
    }
  };
  
  // Create new chapter
  const createChapter = async (formData: any) => {
    try {
      const newChapter: Omit<Chapter, 'id'> = {
        project_id: params.projectId as string,
        title: formData.title,
        description: formData.description || null,
        order_index: chapters.length,
        status: 'draft'
      };
      
      const { data, error } = await supabase
        .from('chapters')
        .insert(newChapter)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setChapters([...chapters, data as Chapter]);
      setCreateDialogOpen(false);
      toast.success("Chapter created successfully");
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast.error("Failed to create chapter");
    }
  };
  
  // Delete chapter
  const deleteChapter = async (chapterId: string) => {
    // Add confirmation dialog logic here
    
    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);
      
      if (error) {
        throw error;
      }
      
      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
      toast.success("Chapter deleted successfully");
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Failed to delete chapter");
    }
  };
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Chapters</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Chapter
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : chapters.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={chapters.map(chapter => chapter.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {chapters.map(chapter => (
                <SortableChapterItem 
                  key={chapter.id} 
                  chapter={chapter} 
                  onDelete={deleteChapter}
                  onViewPages={() => router.push(`/studio/projects/${params.projectId}/chapters/${chapter.id}`)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Chapters Yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first chapter to start organizing your manga
          </p>
          <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
            Create First Chapter
          </Button>
        </div>
      )}
      
      {/* Create Chapter Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chapter</DialogTitle>
            <DialogDescription>
              Add a new chapter to organize your manga pages
            </DialogDescription>
          </DialogHeader>
          
          <ChapterForm onSubmit={createChapter} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sortable Chapter Item Component
interface SortableChapterItemProps {
  chapter: Chapter;
  onDelete: (id: string) => void;
  onViewPages: () => void;
}

function SortableChapterItem({ chapter, onDelete, onViewPages }: SortableChapterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
  });
  
  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
  };
  
  // Calculate chapter completion
  const completionPercentage = 0; // Will need to be calculated based on pages
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`border rounded-lg overflow-hidden ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-stretch">
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="flex items-center justify-center px-4 bg-muted cursor-grab"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {/* Chapter content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{chapter.title}</h3>
                <Badge variant={getStatusVariant(chapter.status)}>
                  {chapter.status}
                </Badge>
              </div>
              {chapter.description && (
                <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewPages}>
                  <FileText className="mr-2 h-4 w-4" /> View Pages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(chapter.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-1" />
          </div>
        </div>
      </div>
    </div>
  );
}