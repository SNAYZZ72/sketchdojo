// src/app/(main)/studio/projects/[projectId]/preview/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { 
  Loader2, 
  ArrowLeft, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  FileX
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Define interfaces for your data
interface Project {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  order_index: number;
  status: string;
}

interface Panel {
  id: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  z_index: number;
  background_id?: string;
  characters?: any[];
  dialog_bubbles?: any[];
  effects?: any[];
}

interface Page {
  id: string;
  chapter_id: string;
  order_index: number;
  content: {
    panels: Panel[];
    background_color?: string;
    page_notes?: string;
  };
  title?: string;
  chapter_title?: string;
}

export default function ProjectPreview() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [project, setProject] = useState<Project | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportQuality, setExportQuality] = useState('medium');
  const [isExporting, setIsExporting] = useState(false);
  
  // Fetch project, chapters, and pages on mount
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.projectId)
          .single();
        
        if (projectError) {
          throw projectError;
        }
        
        setProject(projectData as Project);
        
        // Fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('project_id', params.projectId)
          .order('order_index');
        
        if (chaptersError) {
          throw chaptersError;
        }
        
        setChapters(chaptersData || []);
        
        // Fetch all pages for all chapters
        const allPages: Page[] = [];
        
        for (const chapter of chaptersData || []) {
          const { data: pagesData, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .eq('chapter_id', chapter.id)
            .order('order_index');
          
          if (pagesError) {
            console.error(`Error fetching pages for chapter ${chapter.id}:`, pagesError);
            continue;
          }
          
          // Add chapter info to each page
          const pagesWithChapter = (pagesData || []).map(page => ({
            ...page,
            chapter_title: chapter.title
          }));
          
          allPages.push(...pagesWithChapter);
        }
        
        setPages(allPages);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [params.projectId, supabase]);
  
  // Navigate to next/previous page
  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  
  // Export project
  const exportProject = async () => {
    try {
      setIsExporting(true);
      
      // Simulated export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Project exported as ${exportFormat.toUpperCase()}`);
      setExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting project:", error);
      toast.error("Failed to export project");
    } finally {
      setIsExporting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // No pages found
  if (pages.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
        <FileX className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No Pages Found</h2>
        <p className="mt-2 text-muted-foreground">
          This project doesn't have any pages yet.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => router.push(`/studio/projects/${params.projectId}`)}
        >
          Return to Project
        </Button>
      </div>
    );
  }
  
  // Current page
  const currentPage = pages[currentPageIndex];
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-800">
      {/* Top Bar */}
      <div className="h-16 bg-background border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/studio/projects/${params.projectId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
          </Button>
          <div className="text-sm font-medium">
            {project?.title}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExportDialogOpen(true)}
            className="gap-1"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Page navigation controls */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={goToPrevPage}
          disabled={currentPageIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {/* Current page display */}
        <div className="h-[90vh] aspect-[3/4] bg-white shadow-2xl">
          {/* Render page content */}
          {/* This would need to be implemented based on your page structure */}
          <div className="w-full h-full relative">
            {currentPage.content && currentPage.content.panels && currentPage.content.panels.map((panel: Panel) => (
              <div 
                key={panel.id}
                className="absolute border"
                style={{
                  left: `${panel.position.x}px`,
                  top: `${panel.position.y}px`,
                  width: `${panel.position.width}px`,
                  height: `${panel.position.height}px`,
                  zIndex: panel.z_index
                }}
              >
                {/* Panel content would be rendered here */}
                {/* This is a simplified version */}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={goToNextPage}
          disabled={currentPageIndex === pages.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Bottom Bar */}
      <div className="h-12 bg-background border-t flex items-center justify-between px-4">
        <div className="text-sm">
          Chapter: {currentPage.chapter_title}
        </div>
        <div className="text-sm">
          Page {currentPageIndex + 1} of {pages.length}
        </div>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Project</DialogTitle>
            <DialogDescription>
              Choose export format and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="cbz">CBZ Comic Book</SelectItem>
                  <SelectItem value="images">Image Sequence (ZIP)</SelectItem>
                  <SelectItem value="web">Web Publication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={exportQuality} onValueChange={setExportQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Smaller file size)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {exportFormat === 'pdf' && (
              <div className="space-y-2">
                <Label>PDF Options</Label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox id="include-cover" />
                    <label htmlFor="include-cover" className="text-sm">Include cover page</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="print-marks" />
                    <label htmlFor="print-marks" className="text-sm">Include printer marks</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={exportProject} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}