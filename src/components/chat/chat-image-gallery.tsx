'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, Heart, Bookmark, Maximize2, ChevronDown, ChevronLeft, ChevronRight, Download, Grid, LayoutList, Share2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types for panel data
export interface ImagePanel {
  url: string;
  id: string;
  panelNumber: number;
}

interface ChatImageGalleryProps {
  panels: ImagePanel[];
  viewMode: 'vertical' | 'grid';
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onChangeViewMode?: (mode: 'vertical' | 'grid') => void;
}

/**
 * Component that displays manga panels in either vertical or grid layout
 */
export function ChatImageGallery({
  panels,
  viewMode,
  selectedPanel,
  onSelectPanel,
  onChangeViewMode
}: ChatImageGalleryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<{[key: string]: boolean}>({});
  const [isBookmarked, setIsBookmarked] = useState<{[key: string]: boolean}>({});

  // Scroll to bottom when panels change in vertical mode
  useEffect(() => {
    if (messagesEndRef.current && viewMode === 'vertical') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [panels, viewMode]);

  // Function to handle panel likes
  const handleLikePanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const panelId = panels[index].id;
    setIsLiked(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  // Function to handle panel bookmarks
  const handleBookmarkPanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const panelId = panels[index].id;
    setIsBookmarked(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  // Function to handle panel fullscreen view
  const handleFullscreenPanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  // Function to download a single panel
  const handleDownloadPanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const panel = panels[index];
    const link = document.createElement('a');
    link.href = panel.url;
    link.download = `manga-panel-${panel.panelNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle downloading all panels
  const handleDownloadAll = () => {
    panels.forEach((panel, index) => {
      const link = document.createElement('a');
      link.href = panel.url;
      link.download = `manga-panel-${panel.panelNumber}.png`;
      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300); // Stagger downloads to avoid browser limits
    });
  };

  // Handle view mode toggle if the callback exists
  const toggleViewMode = () => {
    if (onChangeViewMode) {
      onChangeViewMode(viewMode === 'vertical' ? 'grid' : 'vertical');
    }
  };
  
  // Component to show when no panels are available
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 m-6">
      <div className="w-16 h-16 rounded-full bg-gray-800/70 flex items-center justify-center mb-6">
        <Eye className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-white text-lg font-medium mb-2">No manga panels yet</h3>
      <p className="text-white/60 text-sm max-w-md text-center mb-8">
        Start a conversation to create your manga. Describe your characters, setting, and story in the chat to generate panels.
      </p>
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-white/10 border-white/20 hover:bg-white/20 hover:text-white text-white/80"
          onClick={() => {
            // Find and focus the chat input
            const textArea = document.querySelector('textarea');
            if (textArea) textArea.focus();
          }}
        >
          Start Creating
        </Button>
      </div>
    </div>
  );

  // Fullscreen gallery overlay component
  const FullscreenGallery = () => {
    return (
      <motion.div 
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button 
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          onClick={() => setIsFullscreen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white p-2 z-10 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          onClick={() => setFullscreenIndex((prev) => (prev > 0 ? prev - 1 : panels.length - 1))}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white p-2 z-10 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          onClick={() => setFullscreenIndex((prev) => (prev < panels.length - 1 ? prev + 1 : 0))}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        <motion.div 
          key={`fullscreen-${fullscreenIndex}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
        >
          <div className="relative shadow-2xl rounded-lg overflow-hidden">
            <Image 
              src={panels[fullscreenIndex].url} 
              alt={`Panel ${panels[fullscreenIndex].panelNumber}`} 
              className="max-h-[80vh] w-auto object-contain bg-black"
              width={1000}
              height={1500}
              unoptimized={true}
              priority
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white/90">{fullscreenIndex + 1} of {panels.length}</span>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex gap-2">
              <button 
                className="text-white/70 hover:text-white"
                onClick={(e) => handleLikePanel(e, fullscreenIndex)}
              >
                <Heart className={`h-4 w-4 ${isLiked[panels[fullscreenIndex].id] ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button 
                className="text-white/70 hover:text-white"
                onClick={(e) => handleDownloadPanel(e, fullscreenIndex)}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                className="text-white/70 hover:text-white"
                onClick={(e) => handleBookmarkPanel(e, fullscreenIndex)}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked[panels[fullscreenIndex].id] ? 'fill-purple-500 text-purple-500' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900/80 to-black/90 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {/* Fullscreen panel view */}
      <AnimatePresence>
        {isFullscreen && <FullscreenGallery />}
      </AnimatePresence>
      
      {/* Preview header */}
      <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-between p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600/20 rounded-full h-8 w-8 flex items-center justify-center text-purple-400">
            <Eye className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-white/90 text-sm font-medium">Manga Preview</span>
            <span className="text-white/40 text-xs">{panels.length} panels</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleViewMode}
                  className="h-8 w-8 bg-black/30 text-white/70 hover:text-white hover:bg-black/50 rounded-md transition-colors"
                >
                  {viewMode === 'vertical' ? 
                    <Grid className="h-4 w-4" /> : 
                    <LayoutList className="h-4 w-4" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Switch to {viewMode === 'vertical' ? 'grid' : 'vertical'} view
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-black/30 text-white/70 hover:text-white hover:bg-black/50 rounded-md transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-white/10 text-white">
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download all panels
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <Share2 className="h-4 w-4 mr-2" />
                Share gallery
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <Info className="h-4 w-4 mr-2" />
                Panel information
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Download all button */}
          <Button
            size="sm"
            onClick={handleDownloadAll}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 text-white py-1 h-8 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </div>
      
      {/* Panel display based on view mode */}
      {panels.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'vertical' ? (
        <VerticalGallery 
          panels={panels} 
          selectedPanel={selectedPanel} 
          onSelectPanel={onSelectPanel}
          onLike={handleLikePanel}
          onBookmark={handleBookmarkPanel}
          onFullscreen={handleFullscreenPanel}
          onDownload={handleDownloadPanel}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
        />
      ) : (
        <GridGallery 
          panels={panels} 
          selectedPanel={selectedPanel} 
          onSelectPanel={onSelectPanel}
          onFullscreen={handleFullscreenPanel}
          onDownload={handleDownloadPanel}
          onLike={handleLikePanel}
          onBookmark={handleBookmarkPanel}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
        />
      )}
      
      {/* Thumbnail navigation */}
      {panels.length > 0 && (
        <ThumbnailNavigation 
          panels={panels}
          selectedPanel={selectedPanel}
          onSelectPanel={onSelectPanel}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

// Vertical layout component
function VerticalGallery({ 
  panels, 
  selectedPanel, 
  onSelectPanel,
  onLike,
  onBookmark,
  onFullscreen,
  onDownload,
  isLiked,
  isBookmarked
}: {
  panels: ImagePanel[];
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onLike: (event: React.MouseEvent, index: number) => void;
  onBookmark: (event: React.MouseEvent, index: number) => void;
  onFullscreen: (event: React.MouseEvent, index: number) => void;
  onDownload: (event: React.MouseEvent, index: number) => void;
  isLiked: {[key: string]: boolean};
  isBookmarked: {[key: string]: boolean};
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      {panels.map((panel, index) => (
        <motion.div 
          key={panel.id} 
          className="w-full max-w-3xl group relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onClick={() => onSelectPanel(index)}
        >
          <div className={cn(
            "transition-all duration-300 rounded-xl overflow-hidden shadow-2xl relative border",
            selectedPanel === index 
              ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-black/50 border-purple-500/50" 
              : "border-white/10 hover:border-white/30 group-hover:shadow-purple-500/10"
          )}>
            <Image 
              src={panel.url} 
              alt={`Panel ${panel.panelNumber}`} 
              className="w-full h-auto bg-black/40 hover:scale-[1.01] transition-transform duration-500"
              width={800}
              height={1200}
              unoptimized={true}
              priority={index === 0} // Prioritize loading the first image
            />
            
            {/* Panel overlay with controls - visible on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="w-full flex justify-between items-center">
                <div className="p-2 text-white text-sm font-medium backdrop-blur-sm bg-black/30 rounded-md">
                  Panel {panel.panelNumber}
                </div>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => onLike(e, index)}
                          className="h-8 w-8 rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${isLiked[panel.id] ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">{isLiked[panel.id] ? 'Unlike' : 'Like'} panel</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => onBookmark(e, index)}
                          className="h-8 w-8 rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked[panel.id] ? 'fill-purple-500 text-purple-500' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">{isBookmarked[panel.id] ? 'Remove bookmark' : 'Bookmark'} panel</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => onDownload(e, index)}
                          className="h-8 w-8 rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Download panel</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => onFullscreen(e, index)}
                          className="h-8 w-8 rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">View fullscreen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel metadata */}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-white/60 text-xs">
              {index + 1} of {panels.length}
            </span>
            <div className="flex gap-2">
              <span className={cn(
                "text-xs py-0.5 px-2 rounded-full flex items-center gap-1",
                isLiked[panel.id] 
                  ? "bg-red-500/20 text-red-400" 
                  : "bg-white/5 text-white/40"
              )}>
                <Heart className="h-3 w-3" /> 
                {isLiked[panel.id] ? "Liked" : "Like"}
              </span>
              <span className={cn(
                "text-xs py-0.5 px-2 rounded-full flex items-center gap-1",
                isBookmarked[panel.id] 
                  ? "bg-purple-500/20 text-purple-400" 
                  : "bg-white/5 text-white/40"
              )}>
                <Bookmark className="h-3 w-3" /> 
                {isBookmarked[panel.id] ? "Bookmarked" : "Bookmark"}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Grid layout component
function GridGallery({ 
  panels, 
  selectedPanel, 
  onSelectPanel,
  onFullscreen,
  onDownload,
  onLike,
  onBookmark,
  isLiked,
  isBookmarked
}: {
  panels: ImagePanel[];
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onFullscreen: (event: React.MouseEvent, index: number) => void;
  onDownload: (event: React.MouseEvent, index: number) => void;
  onLike: (event: React.MouseEvent, index: number) => void;
  onBookmark: (event: React.MouseEvent, index: number) => void;
  isLiked: {[key: string]: boolean};
  isBookmarked: {[key: string]: boolean};
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {panels.map((panel, index) => (
        <motion.div 
          key={panel.id} 
          className={cn(
            "group relative rounded-lg overflow-hidden bg-black/40 hover:bg-black/50 transition-colors cursor-pointer border",
            selectedPanel === index 
              ? "border-purple-500/50 shadow-md shadow-purple-500/20" 
              : "border-white/10 hover:border-white/30"
          )}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onSelectPanel(index)}
          whileHover={{ y: -4 }}
        >
          <div className="relative aspect-[3/4]">
            <Image 
              src={panel.url} 
              alt={`Panel ${panel.panelNumber}`} 
              className="object-cover bg-black/40 group-hover:scale-105 transition-transform duration-700"
              fill
              unoptimized
              loading={index < 6 ? "eager" : "lazy"} // Load first 6 images eagerly
            />
            
            {/* Selection indicator */}
            {selectedPanel === index && (
              <div className="absolute inset-0 ring-2 ring-purple-500 rounded-lg pointer-events-none"></div>
            )}
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <div className="flex justify-between items-end mb-2">
                <div className="text-white bg-black/40 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
                  Panel {panel.panelNumber}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => onFullscreen(e, index)}
                    className="h-7 w-7 rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-between mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => onLike(e, index)}
                  className={cn(
                    "h-8 px-2 rounded text-xs bg-black/30 hover:bg-black/50 transition-colors border border-transparent",
                    isLiked[panel.id] && "border-red-500/50 text-red-400"
                  )}
                >
                  <Heart className={`h-3.5 w-3.5 mr-1.5 ${isLiked[panel.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  {isLiked[panel.id] ? "Liked" : "Like"}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => onBookmark(e, index)}
                  className={cn(
                    "h-8 px-2 rounded text-xs bg-black/30 hover:bg-black/50 transition-colors border border-transparent",
                    isBookmarked[panel.id] && "border-purple-500/50 text-purple-400"
                  )}
                >
                  <Bookmark className={`h-3.5 w-3.5 mr-1.5 ${isBookmarked[panel.id] ? 'fill-purple-500 text-purple-500' : ''}`} />
                  {isBookmarked[panel.id] ? "Saved" : "Save"}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => onDownload(e, index)}
                  className="h-8 px-2 rounded text-xs bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          </div>
          
          {/* Panel number indicator on the image */}
          <div className="absolute top-2 left-2 bg-black/60 text-white/80 text-xs font-medium px-2 py-0.5 rounded-md">
            #{panel.panelNumber}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Thumbnail navigation component
function ThumbnailNavigation({ 
  panels, 
  selectedPanel, 
  onSelectPanel 
}: {
  panels: ImagePanel[];
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
}) {
  return (
    <div className="sticky bottom-0 w-full bg-black/70 backdrop-blur-md border-t border-white/10 p-2 flex items-center justify-center">
      <div className="w-full max-w-2xl flex items-center gap-2">
        <div className="text-white/60 text-xs w-12 text-center">
          {selectedPanel !== null ? selectedPanel + 1 : 1}/{panels.length}
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {panels.map((panel, index) => (
            <motion.button
              key={`thumb-${panel.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              onClick={() => onSelectPanel(index)}
              className={cn(
                "h-14 w-12 flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 transform",
                selectedPanel === index 
                  ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/30 scale-110 z-10" 
                  : "border border-white/10 hover:border-white/30 hover:scale-105"
              )}
              aria-label={`Select panel ${index + 1}`}
              aria-current={selectedPanel === index ? "true" : "false"}
            >
              <div className="relative h-full w-full">
                <Image 
                  src={panel.url} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="h-full w-full object-cover" 
                  fill
                  sizes="48px"
                  unoptimized
                />
                {/* Highlight overlay for selected thumbnail */}
                {selectedPanel === index && (
                  <div className="absolute inset-0 bg-purple-500/10"></div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="w-12 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Show more options"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-white/10 text-white">
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                Download all panels
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                Share gallery
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                View metadata
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}