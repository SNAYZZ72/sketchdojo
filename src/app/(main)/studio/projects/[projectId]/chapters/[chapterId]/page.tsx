// src/app/(main)/studio/projects/[projectId]/chapters/[chapterId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';

// Import UI components
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Import icons
import {
  ArrowLeft,
  Plus,
  Loader2,
  FileText,
  GripHorizontal,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  ImageIcon
} from 'lucide-react';

// Define interfaces for type safety
interface Page {
  id: string;
  chapter_id: string;
  title?: string;
  order_index: number;
  layout_type: string;
  content: {
    panels: any[];
    background_color?: string;
    page_notes?: string;
  };
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  order_index: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PageManagement() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Fetch chapter and pages on mount
  useEffect(() => {
    const fetchChapterAndPages = async () => {
      try {
        setIsLoading(true);
        
        // Fetch chapter
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', params.chapterId)
          .single();
        
        if (chapterError) {
          throw chapterError;
        }
        
        setChapter(chapterData as Chapter);
        
        // Fetch pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('chapter_id', params.chapterId)
          .order('order_index');
        
        if (pagesError) {
          throw pagesError;
        }
        
        setPages(pagesData as Page[] || []);
      } catch (error) {
        console.error("Error fetching chapter and pages:", error);
        toast.error("Failed to load chapter");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapterAndPages();
  }, [params.chapterId, supabase]);
  
  // DnD handlers for reordering pages
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
      const oldIndex = pages.findIndex(page => page.id === active.id);
      const newIndex = pages.findIndex(page => page.id === over.id);
      
      // Reorder the pages array
      const updatedPages = [...pages];
      const [movedPage] = updatedPages.splice(oldIndex, 1);
      updatedPages.splice(newIndex, 0, movedPage);
      
      // Update the order_index values
      const reorderedPages = updatedPages.map((page, index) => ({
        ...page,
        order_index: index
      }));
      
      // Optimistically update the UI
      setPages(reorderedPages);
      
      // Update the database
      try {
        // For each page that changed position, update its order_index
        for (const page of reorderedPages) {
          if (page.order_index !== pages.find(p => p.id === page.id)?.order_index) {
            await supabase
              .from('pages')
              .update({ order_index: page.order_index })
              .eq('id', page.id);
          }
        }
      } catch (error) {
        console.error("Error updating page order:", error);
        toast.error("Failed to update page order");
        // Revert back to original order if there was an error
        setPages(pages);
      }
    }
  };
  
  // Create new page with a template
  const createPage = async (templateType: string) => {
    try {
      const newPage = {
        chapter_id: params.chapterId,
        order_index: pages.length,
        layout_type: templateType,
        content: {
          panels: [],
          background_color: "#ffffff",
        }
      };
      
      const { data, error } = await supabase
        .from('pages')
        .insert(newPage)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setPages([...pages, data as Page]);
      setCreateDialogOpen(false);
      toast.success("Page created successfully");
      
      // Redirect to the page editor
      router.push(`/studio/projects/${params.projectId}/chapters/${params.chapterId}/${data.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("Failed to create page");
    }
  };
  
  // Delete page
  const deletePage = async (pageId: string) => {
    // Add confirmation dialog logic here
    
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);
      
      if (error) {
        throw error;
      }
      
      setPages(pages.filter(page => page.id !== pageId));
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete page");
    }
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/studio/projects/${params.projectId}/chapters`)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
          </Button>
          <h1 className="text-2xl font-bold">{chapter?.title || 'Loading...'}</h1>
          {chapter?.description && (
            <p className="text-muted-foreground mt-1">{chapter.description}</p>
          )}
        </div>
        
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Page
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : pages.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pages.map(page => page.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {pages.map(page => (
                <SortablePage 
                  key={page.id} 
                  page={page} 
                  onDelete={deletePage}
                  onEdit={() => router.push(`/studio/projects/${params.projectId}/chapters/${params.chapterId}/${page.id}`)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Pages Yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first page to start building your manga chapter
          </p>
          <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
            Create First Page
          </Button>
        </div>
      )}
      
      {/* Page Template Selection Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
            <DialogDescription>
              Choose a page layout template or start with a blank page
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {/* Blank page */}
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => createPage('blank')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-full aspect-[3/4] border-2 border-dashed rounded-md flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-sm font-medium">Blank Page</h4>
              </CardContent>
            </Card>
            
            {/* Sample page templates */}
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => createPage('single_panel')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-full aspect-[3/4] border rounded-md flex items-center justify-center mb-4 bg-muted">
                  <div className="w-5/6 h-5/6 border border-dashed"></div>
                </div>
                <h4 className="text-sm font-medium">Single Panel</h4>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => createPage('grid_4')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-full aspect-[3/4] border rounded-md flex flex-col mb-4 bg-muted p-2">
                  <div className="grid grid-cols-2 gap-2 w-full h-full">
                    <div className="border border-dashed"></div>
                    <div className="border border-dashed"></div>
                    <div className="border border-dashed"></div>
                    <div className="border border-dashed"></div>
                  </div>
                </div>
                <h4 className="text-sm font-medium">4-Panel Grid</h4>
              </CardContent>
            </Card>
            
            {/* Add more templates */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sortable Page Component
function SortablePage({ page, onDelete, onEdit }: { page: Page; onDelete: (id: string) => void; onEdit: () => void }) {
  return (
    <div 
      className="relative border rounded-md overflow-hidden group hover:shadow-md transition-all"
    >
      {/* Drag handle */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 cursor-grab transition-opacity flex items-center justify-center"
      >
        <GripHorizontal className="h-4 w-4 text-white" />
      </div>
      
      {/* Page thumbnail */}
      <div 
        className="w-full aspect-[3/4] bg-white flex items-center justify-center cursor-pointer"
        onClick={onEdit}
      >
        {/* Render page preview based on layout */}
        {renderPageThumbnail(page)}
      </div>
      
      {/* Page info and actions */}
      <div className="p-2 bg-card">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium truncate">
            Page {page.order_index + 1}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(page.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Helper function to render page thumbnail
function renderPageThumbnail(page: Page) {
  switch (page.layout_type) {
    case 'blank':
      return (
        <div className="w-5/6 h-5/6 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
        </div>
      );
    case 'single_panel':
      return (
        <div className="w-5/6 h-5/6 border border-gray-300 bg-gray-50 rounded-md"></div>
      );
    case 'grid_4':
      return (
        <div className="w-5/6 h-5/6 grid grid-cols-2 gap-1">
          <div className="border border-gray-300 bg-gray-50"></div>
          <div className="border border-gray-300 bg-gray-50"></div>
          <div className="border border-gray-300 bg-gray-50"></div>
          <div className="border border-gray-300 bg-gray-50"></div>
        </div>
      );
    default:
      return (
        <div className="w-5/6 h-5/6 border border-gray-300 bg-gray-50 rounded-md"></div>
      );
  }
}