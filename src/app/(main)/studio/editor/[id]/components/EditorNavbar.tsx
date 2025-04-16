// src/app/(main)/studio/editor/[id]/components/EditorNavbar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PanelTop, Save, Settings, ChevronLeft,
  Users, BookOpen, FileText, Layers, ArrowLeft,
  Share2, Eye
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Project } from '@/types/projects';
import { EditorTab } from '@/types/projects';
import { 
  Tooltip, 
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorNavbarProps {
  project: Project;
  currentEpisode: string;
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function EditorNavbar({ 
  project,
  currentEpisode,
  activeTab,
  onTabChange,
  onSave,
  isSaving = false
}: EditorNavbarProps) {
  // State to track sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if there are unsaved changes
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Listen for sidebar state changes
  useEffect(() => {
    // Check initial state from localStorage
    const savedState = localStorage.getItem('sketchdojo-sidebar-collapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
    
    // Set isDirty to true after a delay to simulate changes for demo purposes
    // In a real implementation, this would be based on actual content changes
    const timer = setTimeout(() => {
      setIsDirty(true);
    }, 5000);
    
    // Listen for sidebar state changes
    const handleSidebarStateChange = () => {
      const currentState = localStorage.getItem('sketchdojo-sidebar-collapsed') === 'true';
      setIsSidebarCollapsed(currentState);
    };
    
    window.addEventListener('sidebar-state-changed', handleSidebarStateChange);
    
    return () => {
      window.removeEventListener('sidebar-state-changed', handleSidebarStateChange);
      clearTimeout(timer);
    };
  }, []);

  // Array of available tabs with their icons
  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'anime-forge', label: 'Anime Forge', icon: <Layers className="h-4 w-4" /> },
    { id: 'characters', label: 'Characters', icon: <Users className="h-4 w-4" /> },
    { id: 'story', label: 'Story', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'screenplay', label: 'Screenplay', icon: <FileText className="h-4 w-4" /> },
    { id: 'editor', label: 'Editor', icon: <PanelTop className="h-4 w-4" /> },
  ];

  // Handle tab change
  const handleTabChange = (tab: EditorTab) => {
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
    onTabChange(tab);
  };

  // Handle save with automatic state reset
  const handleSave = () => {
    onSave();
    // Reset isDirty after saving (normally this would be set based on content changes)
    setTimeout(() => {
      setIsDirty(false);
    }, 1000);
  };

  return (
  <header className={`h-12 border-b border-white/10 bg-background/95 backdrop-blur sticky top-0 z-50 flex items-center transition-all duration-300 w-full`}>
      <div className="flex items-center px-2 md:px-4 gap-2 w-full">
        {/* Mobile Back Button */}
        <div className="flex md:hidden">
          <Link href="/studio/projects">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Left Side - Project Info & Logo */}
        <div className="flex items-center">
          <Link 
            href="/studio/projects" 
            className="hidden md:flex items-center mr-6 group"
          >
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center mr-2 group-hover:bg-primary/20 transition-colors">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              SketchDojo
            </span>
          </Link>
          
          <div className="flex items-center">
            <h1 className="font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-full">
              {project.title}
            </h1>
            {currentEpisode && (
              <span className="text-muted-foreground text-xs ml-1.5 px-1.5 py-0.5 bg-white/5 rounded hidden md:inline-block">
                {currentEpisode}
              </span>
            )}
          </div>
        </div>
        
        {/* Center - Editor Tabs - Desktop */}
        <nav className="hidden md:flex items-center flex-1 justify-center space-x-1">
          <TooltipProvider>
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all relative group",
                      activeTab === tab.id 
                        ? "text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-t-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        
        {/* Mobile Tabs Toggle */}
        <div className="flex md:hidden flex-1 justify-center">
          <DropdownMenu open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white/5 border border-white/10 text-white"
              >
                {tabs.find(t => t.id === activeTab)?.label || 'Select Tab'}
                <ChevronLeft className={cn(
                  "h-4 w-4 ml-1 transition-transform",
                  showMobileMenu ? "rotate-90" : "-rotate-90"
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="bg-background/95 backdrop-blur border-white/10"
            >
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  className={cn(
                    "flex items-center gap-2",
                    activeTab === tab.id && "bg-white/5 text-primary"
                  )}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Right Side - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Preview Button - Hidden on mobile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/5 hidden md:flex"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Share Button - Hidden on mobile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/5 hidden md:flex"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Save Button */}
          <Button 
            size="sm" 
            variant={isDirty ? "default" : "outline"} 
            className={cn(
              "h-8 text-xs relative overflow-hidden",
              isDirty 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "border-white/20 hover:bg-white/5 hover:text-primary"
            )}
            onClick={handleSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                <span>Saving</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-1" />
                <span>Save</span>
                {isDirty && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                )}
              </>
            )}
          </Button>
          
          {/* Publish Button */}
          <Button 
            size="sm" 
            variant="default" 
            className="h-8 bg-gradient-to-r from-primary to-accent hover:shadow-md hover:shadow-primary/20 transition-all duration-300 text-xs hidden md:flex"
          >
            Publish
          </Button>
          
          {/* Settings Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}