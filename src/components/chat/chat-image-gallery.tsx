'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Heart, Bookmark, Maximize2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
}

/**
 * Component that displays manga panels in either vertical or grid layout
 */
export function ChatImageGallery({
  panels,
  viewMode,
  selectedPanel,
  onSelectPanel
}: ChatImageGalleryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when panels change
  useEffect(() => {
    if (messagesEndRef.current && viewMode === 'vertical') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [panels, viewMode]);

  // Function to handle panel likes (placeholder)
  const handleLikePanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    console.log(`Liked panel ${index}`);
    // Would implement actual like functionality here
  };

  // Function to handle panel bookmarks (placeholder)
  const handleBookmarkPanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    console.log(`Bookmarked panel ${index}`);
    // Would implement actual bookmark functionality here
  };

  // Function to handle panel zoom/fullscreen
  const handleFullscreenPanel = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    console.log(`Viewing panel ${index} in fullscreen`);
    // Would implement fullscreen/lightbox view here
  };

  // Component to show when no panels are available
  const EmptyState = () => (
    <div className="text-center text-white/50 py-10 sm:py-20 px-4 flex flex-col items-center justify-center gap-3 sm:gap-4 bg-black/30 rounded-xl max-w-md mx-auto mt-6 sm:mt-10 border border-white/5">
      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-black/50 flex items-center justify-center">
        <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white/30" />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-white text-sm sm:text-base font-medium">No manga panels yet</h3>
        <p className="text-white/50 text-xs sm:text-sm">Start a conversation to create your manga. Describe your characters, setting, and story.</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900/80 to-black/90 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {/* Preview header */}
      <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-between p-2 sm:p-3 border-b border-white/5">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="bg-purple-600/20 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center text-purple-400">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-white/90 text-xs sm:text-sm font-medium">Manga Preview</span>
            <span className="text-white/40 text-[10px] sm:text-xs">{panels.length} panels</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="bg-black/40 hover:bg-black/60 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 rounded-full h-6 sm:h-8 px-2 sm:px-3 flex items-center gap-1 text-white shadow-lg shadow-purple-600/20 transition-colors">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-xs">Download</span>
          </button>
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
        />
      ) : (
        <GridGallery 
          panels={panels} 
          selectedPanel={selectedPanel} 
          onSelectPanel={onSelectPanel}
          onFullscreen={handleFullscreenPanel}
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
  onFullscreen
}: {
  panels: ImagePanel[];
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onLike: (event: React.MouseEvent, index: number) => void;
  onBookmark: (event: React.MouseEvent, index: number) => void;
  onFullscreen: (event: React.MouseEvent, index: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 px-3 sm:px-6 py-4 sm:py-8">
      {panels.map((panel, index) => (
        <div 
          key={panel.id} 
          className="w-full max-w-3xl group relative"
          onClick={() => onSelectPanel(index)}
        >
          <div className={cn(
            "transition-all duration-300 rounded-xl overflow-hidden shadow-xl sm:shadow-2xl",
            selectedPanel === index 
              ? "ring-2 sm:ring-4 ring-purple-500 ring-offset-2 sm:ring-offset-4 ring-offset-black/50" 
              : "border border-white/10 hover:border-white/30"
          )}>
            <Image 
              src={panel.url} 
              alt={`Panel ${panel.panelNumber}`} 
              className="w-full h-auto bg-black/40 hover:scale-[1.01] transition-transform"
              width={800}
              height={1200}
              unoptimized={true}
              priority={index === 0} // Prioritize loading the first image
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 sm:p-4">
              <div className="p-1 sm:p-2 text-white text-xs sm:text-sm font-medium backdrop-blur-sm bg-black/30 rounded-lg">
                Panel {panel.panelNumber}
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-1 sm:p-2 backdrop-blur-sm bg-black/30 rounded-lg text-white/80 hover:text-white"
                  onClick={(e) => onFullscreen(e, index)}
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex justify-between">
            <span className="text-white/60 text-xs sm:text-sm">
              {index + 1} of {panels.length}
            </span>
            <div className="flex gap-1">
              <button 
                className="text-white/60 hover:text-white p-1"
                onClick={(e) => onLike(e, index)}
                aria-label="Like panel"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button 
                className="text-white/60 hover:text-white p-1"
                onClick={(e) => onBookmark(e, index)}
                aria-label="Bookmark panel"
              >
                <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Grid layout component
function GridGallery({ 
  panels, 
  selectedPanel, 
  onSelectPanel,
  onFullscreen
}: {
  panels: ImagePanel[];
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onFullscreen: (event: React.MouseEvent, index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 p-4">
      {panels.map((panel, index) => (
        <div 
          key={panel.id} 
          className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          onClick={() => onSelectPanel(index)}
        >
          <Image 
            src={panel.url} 
            alt={`Panel ${panel.panelNumber}`} 
            className="w-full h-auto aspect-[3/4] object-cover bg-black/40"
            width={400}
            height={533}
            unoptimized
            loading={index < 6 ? "eager" : "lazy"} // Load first 6 images eagerly
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs sm:text-sm font-medium flex justify-between items-center">
              <span>Panel {panel.panelNumber}</span>
              <button 
                className="bg-black/50 p-1 rounded hover:bg-black/70"
                onClick={(e) => onFullscreen(e, index)}
                aria-label="View fullscreen"
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
          {selectedPanel === index && (
            <div className="absolute inset-0 border-2 sm:border-4 border-purple-500 rounded-lg pointer-events-none"></div>
          )}
        </div>
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
        <div className="text-white/60 text-xs w-8 sm:w-14 text-center">
          {selectedPanel !== null ? selectedPanel + 1 : 1}/{panels.length}
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {panels.map((panel, index) => (
            <button
              key={`thumb-${panel.id}`}
              onClick={() => onSelectPanel(index)}
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border rounded-md overflow-hidden transition-all",
                selectedPanel === index 
                  ? "border-purple-500 shadow-lg shadow-purple-500/30" 
                  : "border-white/10 hover:border-white/30"
              )}
              aria-label={`Select panel ${index + 1}`}
              aria-current={selectedPanel === index ? "true" : "false"}
            >
              <Image 
                src={panel.url} 
                alt={`Thumbnail ${index + 1}`} 
                className="h-full w-full object-cover" 
                width={80}
                height={80}
                unoptimized
              />
            </button>
          ))}
        </div>
        <div className="w-8 sm:w-14 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Show more options"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import required for download button
function Download({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}