"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Save, 
  BookOpen, 
  Pencil, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Trash2, 
  AlignLeft, 
  Clock, 
  Info, 
  HelpCircle, 
  X, 
  ChevronRight,
  ChevronLeft,
  ArrowUpDown, 
  BookMarked, 
  LayoutList,
  CheckCircle,
  Loader2,
  List,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChapterDialog } from '@/components/chapter-dialog';
import { Project } from '@/types/projects';
import { chapterService } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

interface StoryTabProps {
  projectId: string;
  project?: Project;
}

// Define the Chapter interface to match what's used in the component
interface Chapter {
  id: string;
  title: string;
  description: string;
  status: string;
  order_index: number;
  page_count: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

// Mock chapters data (replace with actual API data in production)
const mockChapters: Chapter[] = [
  {
    id: 'ch-1',
    title: 'The Beginning',
    description: 'Introduction to the main character and the world',
    status: 'completed',
    order_index: 0,
    page_count: 24,
    project_id: '',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ch-2',
    title: 'The Awakening',
    description: 'The protagonist discovers their hidden powers',
    status: 'in-progress',
    order_index: 1,
    page_count: 18,
    project_id: '',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ch-3',
    title: 'The Confrontation',
    description: 'First encounter with the antagonist',
    status: 'draft',
    order_index: 2,
    page_count: 0,
    project_id: '',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export function StoryTab({ projectId, project }: StoryTabProps) {
  // State
  const [story, setStory] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    // Fetch chapters from API
    const fetchChapters = async () => {
      try {
        const response = await chapterService.getChapters(projectId);
        if (response.success && response.data) {
          setChapters(response.data as Chapter[]);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        // Use mock data as fallback
        setChapters(mockChapters);
      }
    };

    fetchChapters();
  }, [projectId]);

  // Calculate word count when story changes
  useEffect(() => {
    const words = story.trim() ? story.trim().split(/\s+/).length : 0;
    setWordCount(words);

    // Setup autosave
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (story.trim() && isEditing) {
        handleAutoSave();
      }
    }, 30000); // Autosave after 30 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [story, isEditing]);

  // Handlers
  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
    setIsEditing(true);
  };

  const handleSaveStory = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save the story to the project
      // In production: Replace with actual API call
      // await projectService.updateProject(projectId, { story });
      
      toast.success('Story saved successfully');
      setLastSaved(new Date());
      setIsEditing(false);
    } catch (error) {
      toast.error('Error saving story');
      console.error('Error saving story:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      // Simulate API call without showing loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production: Replace with actual API call
      // await projectService.updateProject(projectId, { story });
      
      setLastSaved(new Date());
      toast.success('Story autosaved', { duration: 2000 });
    } catch (error) {
      console.error('Error autosaving story:', error);
      // Don't show error toast for autosave to avoid annoying the user
    }
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsChapterDialogOpen(true);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      try {
        // In production: Replace with actual API call
        // const response = await chapterService.deleteChapter(chapterId);
        
        // Optimistic update
        setChapters(chapters.filter(ch => ch.id !== chapterId));
        toast.success('Chapter deleted successfully');
      } catch (error) {
        toast.error('Error deleting chapter');
        console.error('Error deleting chapter:', error);
      }
    }
  };

  const handleSubmitChapter = async (data: Partial<Chapter>) => {
    setIsSubmitting(true);
    
    try {
      if (editingChapter) {
        // Update existing chapter
        // In production: Replace with actual API call
        // const response = await chapterService.updateChapter(editingChapter.id, data);
        
        // Optimistic update
        setChapters(chapters.map(ch => 
          ch.id === editingChapter.id 
            ? { ...ch, ...data, updated_at: new Date().toISOString() } 
            : ch
        ));
        
        toast.success('Chapter updated successfully');
      } else {
        // Create new chapter
        // Send the chapter data to the API
        const chapterData = {
          project_id: projectId,
          title: data.title || 'Untitled Chapter',
          description: data.description || '',
          status: data.status || 'draft',
          order_index: chapters.length,
          page_count: 0
        };
        
        const response = await chapterService.createChapter(chapterData);
        
        if (response.success && response.data) {
          setChapters([...chapters, response.data as Chapter]);
          toast.success('Chapter created successfully');
        } else {
          toast.error(response.error || 'Failed to create chapter');
        }
      }
      
      setIsChapterDialogOpen(false);
    } catch (error) {
      toast.error('Error saving chapter');
      console.error('Error saving chapter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorderChapters = (dragIndex: number, hoverIndex: number) => {
    const reorderedChapters = [...chapters];
    const draggedChapter = reorderedChapters[dragIndex];
    
    // Remove from dragIndex, insert at hoverIndex
    reorderedChapters.splice(dragIndex, 1);
    reorderedChapters.splice(hoverIndex, 0, draggedChapter);
    
    // Update order_index for each chapter
    const updatedChapters = reorderedChapters.map((ch, idx) => ({
      ...ch,
      order_index: idx
    }));
    
    setChapters(updatedChapters);
    
    // In production: Save the new order to the backend
    // updateChapterOrder(updatedChapters);
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    
    // In a real app, you would load the chapter content
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      // For demo purposes, we're just setting a placeholder story
      setStory(`# ${chapter.title}\n\n${chapter.description}\n\nThis is the content of chapter ${chapter.title}. Start writing your story here...\n\n`);
      setIsEditing(false);
      setLastSaved(new Date(chapter.updated_at));
    }
  };

  // Helper functions
  const getChapterStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500 bg-yellow-500/10">Draft</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="text-blue-500 border-blue-500 bg-blue-500/10">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate total completion
  const calculateTotalCompletion = () => {
    if (chapters.length === 0) return 0;
    
    const completedChapters = chapters.filter(ch => ch.status === 'completed').length;
    const percentage = (completedChapters / chapters.length) * 100;
    return Math.round(percentage);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-1 h-full">
      {/* Chapters sidebar */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.div 
            className="w-80 bg-sketchdojo-bg/50 backdrop-blur-sm border-r border-white/10 flex flex-col h-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-sketchdojo-primary" />
                  Chapters
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddChapter}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center text-xs text-white/60 mb-1">
                <span className="mr-2">{chapters.length} Chapters</span>
                <span>•</span>
                <span className="ml-2">Overall Completion</span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between items-center text-xs text-white/60 mb-1">
                  <span>Progress</span>
                  <span className="text-sketchdojo-primary">{calculateTotalCompletion()}%</span>
                </div>
                <div className="h-1.5 w-full bg-sketchdojo-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent rounded-full transition-all duration-1000"
                    style={{ width: `${calculateTotalCompletion()}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <motion.div
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {chapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                      "p-3 rounded-md border border-white/10 cursor-pointer transition-all duration-200", 
                      selectedChapterId === chapter.id ? "bg-sketchdojo-primary/20 border-sketchdojo-primary/50" : "hover:bg-white/5 hover:border-white/20"
                    )}
                    onClick={() => handleSelectChapter(chapter.id)}
                    draggable
                    onDragStart={(e) => {
                      if (e.dataTransfer) {
                        e.dataTransfer.setData('text/plain', index.toString());
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer) {
                        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        handleReorderChapters(dragIndex, index);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white text-sm flex items-center">
                        <span className="flex items-center justify-center w-5 h-5 bg-sketchdojo-primary/20 rounded-full text-xs mr-2">
                          {chapter.order_index + 1}
                        </span>
                        {chapter.title}
                      </h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-white hover:bg-white/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditChapter(chapter);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChapter(chapter.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-white/60 text-xs mb-2 line-clamp-2">
                      {chapter.description || "No description provided."}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(chapter.updated_at), { addSuffix: true })}
                      </span>
                      <div>{getChapterStatusBadge(chapter.status)}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {chapters.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                  <div className="w-16 h-16 bg-sketchdojo-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-sketchdojo-primary" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No Chapters Yet</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Start by creating your first chapter to organize your manga story.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleAddChapter}
                    className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Chapter
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 bg-sketchdojo-bg/70">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/20 hover:bg-white/10 text-white/80"
                onClick={handleAddChapter}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Chapter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collapse/Expand Button */}
      <div className="flex flex-col items-center py-4 relative">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-12 bg-sketchdojo-bg-light border border-white/10 rounded-r-md hover:bg-sketchdojo-bg hover:border-white/20 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-white/80" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white/80" />
          )}
        </button>
      </div>
      
      {/* Story Editor */}
      <div className="flex-1 flex flex-col h-full">
        {/* Editor Toolbar */}
        <div className="border-b border-white/10 p-4 flex justify-between items-center bg-sketchdojo-bg/30">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-sketchdojo-primary" />
              Story Development
            </h2>
            {selectedChapterId && (
              <Badge className="ml-3 bg-sketchdojo-primary/20 text-white border-0">
                {chapters.find(ch => ch.id === selectedChapterId)?.title || 'Chapter'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Word Count */}
            <div className="text-xs text-white/60 flex items-center mr-2">
              <AlignLeft className="h-3 w-3 mr-1" />
              {wordCount} words
            </div>
            
            {/* Last Saved */}
            {lastSaved && (
              <div className="text-xs text-white/60 flex items-center mr-2">
                <Clock className="h-3 w-3 mr-1" />
                Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </div>
            )}
            
            {/* Help button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Writing tips and help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Save button */}
            <Button 
              onClick={handleSaveStory}
              disabled={isSaving || !isEditing}
              className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Story
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Editor and Help Panels */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 px-6 py-4 overflow-auto">
              <AnimatePresence mode="wait">
                {showHelp ? (
                  <motion.div
                    key="help-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <Info className="mr-2 h-5 w-5 text-sketchdojo-primary" />
                        Writing Tips and Help
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setShowHelp(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white text-md font-medium mb-2 flex items-center">
                          <BookMarked className="mr-2 h-4 w-4 text-sketchdojo-primary" />
                          Story Structure
                        </h4>
                        <p className="text-white/80 text-sm mb-2">
                          A well-structured manga story typically includes:
                        </p>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1 ml-2">
                          <li>Introduction of the main characters and setting</li>
                          <li>Establishing the main conflict or goal</li>
                          <li>Rising action with obstacles and challenges</li>
                          <li>Climactic confrontation or revelation</li>
                          <li>Resolution and setup for future chapters</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white text-md font-medium mb-2 flex items-center">
                          <LayoutList className="mr-2 h-4 w-4 text-sketchdojo-accent" />
                          Chapter Organization
                        </h4>
                        <p className="text-white/80 text-sm mb-2">
                          Organizing your story into chapters helps with pacing and readability:
                        </p>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1 ml-2">
                          <li>Aim for 15-30 pages per chapter for most manga formats</li>
                          <li>Each chapter should have a mini-arc with beginning, middle, and end</li>
                          <li>End chapters with hooks to keep readers engaged</li>
                          <li>Consider transitions between scenes within chapters</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white text-md font-medium mb-2 flex items-center">
                          <Pencil className="mr-2 h-4 w-4 text-sketchdojo-primary" />
                          Writing Style for Manga
                        </h4>
                        <p className="text-white/80 text-sm mb-2">
                          When writing for manga, keep these points in mind:
                        </p>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1 ml-2">
                          <li>Balance dialogue with visual descriptions</li>
                          <li>Be concise - manga relies heavily on visuals</li>
                          <li>Use scene descriptions to help visualize panels</li>
                          <li>Consider sound effects and visual onomatopoeia</li>
                          <li>Write character emotions that can be visually expressed</li>
                        </ul>
                      </div>
                      
                      <div className="bg-sketchdojo-primary/20 p-4 rounded-lg border border-sketchdojo-primary/30">
                        <h4 className="text-white text-md font-medium mb-2 flex items-center">
                          <Settings className="mr-2 h-4 w-4 text-sketchdojo-primary" />
                          Using the Editor
                        </h4>
                        <p className="text-white/80 text-sm mb-2">
                          Tips for using SketchDojo's story editor:
                        </p>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1 ml-2">
                          <li>Your work autosaves every 30 seconds while editing</li>
                          <li>Create chapters to organize your story</li>
                          <li>Click on chapters in the sidebar to edit them</li>
                          <li>Drag chapters to reorder them</li>
                          <li>Use "Save Story" to manually save your progress</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="story-editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {!selectedChapterId && chapters.length > 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-sketchdojo-primary/10 rounded-full flex items-center justify-center mb-4">
                          <ChevronLeft className="h-6 w-6 text-sketchdojo-primary" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Select a Chapter</h3>
                        <p className="text-white/60 text-sm mb-4 max-w-sm">
                          Choose a chapter from the sidebar to start writing, or create a new chapter if you haven't already.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-white/10 bg-sketchdojo-bg/50 backdrop-blur-sm rounded-lg h-full flex flex-col p-1">
                        <textarea 
                          ref={textareaRef}
                          className="w-full h-full bg-transparent outline-none resize-none p-4 text-white/90 placeholder:text-white/30"
                          placeholder={chapters.length === 0 ? 
                            "Start by creating a chapter from the sidebar, then write your story here..." : 
                            "Start writing your story here..."
                          }
                          value={story}
                          onChange={handleStoryChange}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chapter Dialog */}
      <ChapterDialog
        open={isChapterDialogOpen}
        onOpenChange={setIsChapterDialogOpen}
        chapter={editingChapter}
        onSubmit={handleSubmitChapter}
      />
    </div>
  );
}