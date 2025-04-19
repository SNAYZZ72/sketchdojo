'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Copy, 
  Trash, 
  Edit3, 
  PlusCircle, 
  Move, 
  MousePointer, 
  Layers, 
  Save,
  Download,
  ArrowUpRight,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  Maximize2,
  ChevronDown,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePanel } from './chat-image-gallery';
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
import {
  Slider
} from "@/components/ui/slider";

interface ChatImageEditorProps {
  panels: ImagePanel[];
  zoom: number;
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
  onZoomChange?: (zoom: number) => void;
}

/**
 * Enhanced component for editing manga panels with advanced tools
 */
export function ChatImageEditor({
  panels,
  zoom,
  selectedPanel,
  onSelectPanel,
  onZoomChange
}: ChatImageEditorProps) {
  const [activeEditorTool, setActiveEditorTool] = useState<'select' | 'move' | 'add' | 'delete'>('select');
  const [isPanelFullscreen, setIsPanelFullscreen] = useState(false);
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  const [panelWidth, setPanelWidth] = useState<string>("280");
  const [panelHeight, setPanelHeight] = useState<string>("350");
  const [panelX, setPanelX] = useState<string>("120");
  const [panelY, setPanelY] = useState<string>("80");
  const [panelCaption, setPanelCaption] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Update panel properties when selection changes
  useEffect(() => {
    if (selectedPanel !== null && panels.length > 0) {
      // In a real implementation, these would come from the selected panel's data
      setPanelWidth("280");
      setPanelHeight("350");
      setPanelX("120");
      setPanelY("80");
      setPanelCaption("");
    }
  }, [selectedPanel, panels]);
  
  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  // Function to duplicate a panel
  const handleDuplicatePanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    // Add to undo history
    setUndoHistory(prev => [...prev, `duplicate-panel-${index}`]);
    setRedoHistory([]);
    // Would implement actual duplication functionality here
  };

  // Function to delete a panel
  const handleDeletePanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    // Add to undo history
    setUndoHistory(prev => [...prev, `delete-panel-${index}`]);
    setRedoHistory([]);
    // Would implement actual deletion functionality here
  };

  // Function to edit a panel
  const handleEditPanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    // Would implement actual edit functionality here
  };
  
  // Function to save panel properties
  const handleSaveProperties = () => {
    // Add to undo history
    setUndoHistory(prev => [...prev, `save-properties`]);
    setRedoHistory([]);
    
    // Would implement actual saving functionality here
    console.log('Saving panel properties', {
      width: panelWidth,
      height: panelHeight,
      x: panelX,
      y: panelY,
      caption: panelCaption
    });
  };
  
  // Function to undo last action
  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const lastAction = undoHistory[undoHistory.length - 1];
      setUndoHistory(prev => prev.slice(0, -1));
      setRedoHistory(prev => [...prev, lastAction]);
      
      // Would implement actual undo functionality here
      console.log('Undoing action', lastAction);
    }
  };
  
  // Function to redo last undone action
  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const lastAction = redoHistory[redoHistory.length - 1];
      setRedoHistory(prev => prev.slice(0, -1));
      setUndoHistory(prev => [...prev, lastAction]);
      
      // Would implement actual redo functionality here
      console.log('Redoing action', lastAction);
    }
  };
  
  // Function to export the current layout
  const handleExportLayout = () => {
    // Would implement actual export functionality here
    console.log('Exporting layout');
  };
  
  // Function for mouse down on panel to start dragging
  const handlePanelMouseDown = (e: React.MouseEvent, index: number) => {
    if (activeEditorTool === 'move') {
      e.preventDefault();
      setIsDragging(true);
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Would implement actual drag start functionality here
    }
  };
  
  // Function for mouse move during dragging
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedPanel !== null && activeEditorTool === 'move') {
      // Calculate new position
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      // Update position
      setPanelX(newX.toFixed(0));
      setPanelY(newY.toFixed(0));
      
      // Would implement actual dragging functionality here
    }
  };
  
  // Function for mouse up to end dragging
  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Add to undo history after moving
      setUndoHistory(prev => [...prev, `move-panel-${selectedPanel}`]);
      setRedoHistory([]);
      
      // Would implement actual drag end functionality here
    }
  };

  // Empty state component for when no panels are available
  const EmptyState = () => (
    <motion.div 
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center text-white/40 max-w-md bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-white/10">
        <motion.div 
          className="h-20 w-20 mx-auto mb-4 rounded-full bg-black/30 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Layers className="h-10 w-10 text-white/20" />
        </motion.div>
        <h3 className="text-white/80 text-lg font-medium mb-2">No Manga Panels Yet</h3>
        <p className="text-white/40 text-sm mb-6">
          Start a conversation in the chat to generate manga panels that you can edit here.
        </p>
        <Button 
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
          onClick={() => window.history.back()} // Simple navigation back
        >
          Return to Chat
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Editor Canvas */}
      <div 
        className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto relative p-4"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Editor toolbar */}
        <div className="sticky top-0 z-10 mb-4 flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleUndo}
                  disabled={undoHistory.length === 0}
                  className={cn(
                    "h-8 w-8 rounded-md text-white/70 hover:text-white transition-colors",
                    undoHistory.length === 0 ? "opacity-50 hover:bg-transparent" : "hover:bg-white/10"
                  )}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                  className={cn(
                    "h-8 w-8 rounded-md text-white/70 hover:text-white transition-colors",
                    redoHistory.length === 0 ? "opacity-50 hover:bg-transparent" : "hover:bg-white/10"
                  )}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleZoomChange(Math.max(30, zoom - 10))}
                  className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded-md min-w-16 justify-center">
            <span className="text-white/80 text-xs">{zoom}%</span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleZoomChange(Math.min(200, zoom + 10))}
                  className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleZoomChange(100)}
                  className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Reset zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          
          {/* Alignment buttons */}
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Align left</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Align center</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Align right</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="ml-auto"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleExportLayout}
                  className="h-8 px-3 bg-black/30 text-white/80 hover:bg-black/50 hover:text-white border border-white/10 hover:border-white/30 transition-colors rounded-md"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Export current layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default"
                  size="sm"
                  className="h-8 px-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:opacity-90 rounded-md shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Save current layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div 
          className="min-h-full w-full min-w-full flex items-center justify-center relative"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(75, 75, 75, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          <div 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform origin-center"
            style={{ transform: `translate(-50%, -50%) scale(${zoom/100})` }}
          >
            {/* Canvas Content */}
            <div className="w-[1200px] h-[800px] flex flex-wrap gap-4 p-8 content-start border border-white/5 bg-black/10 rounded-lg">
              {panels.length > 0 ? (
                panels.map((panel, index) => (
                  <motion.div 
                    key={panel.id} 
                    className={cn(
                      "group border relative", 
                      selectedPanel === index 
                        ? "border-purple-500 shadow-xl shadow-purple-500/20" 
                        : "border-white/10 hover:border-white/30",
                      activeEditorTool === 'move' && selectedPanel === index ? "cursor-move" : "cursor-pointer"
                    )}
                    style={{ width: '280px', height: '350px' }}
                    onClick={() => onSelectPanel(index)}
                    onMouseDown={(e) => handlePanelMouseDown(e, index)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Image 
                      src={panel.url} 
                      alt={`Panel ${panel.panelNumber}`} 
                      className="w-full h-full object-cover"
                      width={280}
                      height={350}
                      unoptimized={true}
                    />
                    
                    {/* Selected panel indicator */}
                    {selectedPanel === index && (
                      <div className="absolute -inset-0.5 border-2 border-purple-500 rounded pointer-events-none"></div>
                    )}
                    
                    {/* Panel overlay with controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 flex justify-between items-center">
                      <span className="text-white/80 text-xs">Panel {panel.panelNumber}</span>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                                onClick={(e) => handleDuplicatePanel(e, index)}
                                aria-label="Duplicate panel"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Duplicate panel</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                                onClick={(e) => handleDeletePanel(e, index)}
                                aria-label="Delete panel"
                              >
                                <Trash className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Delete panel</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                                onClick={(e) => handleEditPanel(e, index)}
                                aria-label="Edit panel"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Edit panel</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                                onClick={() => setIsPanelFullscreen(true)}
                                aria-label="View fullscreen"
                              >
                                <Maximize2 className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Fullscreen view</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {/* Panel number indicator */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white/80 text-xs rounded px-1.5 py-0.5">
                      #{panel.panelNumber}
                    </div>
                    
                    {/* Tool indicators - shown when using specific tools */}
                    {activeEditorTool === 'move' && selectedPanel === index && (
                      <div className="absolute top-2 right-2 bg-purple-500/80 text-white text-xs rounded px-1.5 py-0.5 flex items-center">
                        <Move className="h-3 w-3 mr-1" />
                        Moving
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Tools Sidebar */}
      <div className="w-64 border-l border-white/10 bg-black/50 backdrop-blur-sm flex flex-col">
        {/* Tools header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-white/90 font-medium text-sm">Editor Tools</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 rounded-md text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-gray-900 border-white/10 text-white/90"
            >
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Open in external editor
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Export layout
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <Info className="h-4 w-4 mr-2" />
                Editor help
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Tools content */}
        <div className="p-3 flex-1 overflow-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Tool selection */}
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-white/60 text-xs mb-2 font-medium">Tools</div>
              <div className="grid grid-cols-4 gap-1">
                <EditorToolButton 
                  icon={<MousePointer className="h-4 w-4 mb-1" />}
                  label="Select"
                  isActive={activeEditorTool === 'select'} 
                  onClick={() => setActiveEditorTool('select')}
                />
                <EditorToolButton 
                  icon={<Move className="h-4 w-4 mb-1" />}
                  label="Move"
                  isActive={activeEditorTool === 'move'} 
                  onClick={() => setActiveEditorTool('move')}
                />
                <EditorToolButton 
                  icon={<PlusCircle className="h-4 w-4 mb-1" />}
                  label="Add"
                  isActive={activeEditorTool === 'add'} 
                  onClick={() => setActiveEditorTool('add')}
                />
                <EditorToolButton 
                  icon={<Trash className="h-4 w-4 mb-1" />}
                  label="Delete"
                  isActive={activeEditorTool === 'delete'} 
                  onClick={() => setActiveEditorTool('delete')}
                />
              </div>
            </div>
            
            {/* Panel Properties Section */}
            {selectedPanel !== null && panels.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-black/20 rounded-lg border border-white/5"
              >
                <div className="text-white/60 text-xs mb-2 font-medium flex items-center justify-between">
                  <span>Panel Properties</span>
                  {selectedPanel !== null && (
                    <span className="text-purple-400">Panel {panels[selectedPanel].panelNumber}</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 mb-1">Width</span>
                      <input 
                        type="text" 
                        value={panelWidth} 
                        className="bg-black/30 text-white border border-white/20 rounded-md px-2 py-1 text-xs focus:border-purple-500 focus:outline-none"
                        onChange={(e) => setPanelWidth(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 mb-1">Height</span>
                      <input 
                        type="text" 
                        value={panelHeight} 
                        className="bg-black/30 text-white border border-white/20 rounded-md px-2 py-1 text-xs focus:border-purple-500 focus:outline-none"
                        onChange={(e) => setPanelHeight(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 mb-1">Position</span>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 text-xs">X:</span>
                        <input 
                          type="text" 
                          value={panelX} 
                          className="bg-black/30 text-white border border-white/20 rounded-md px-2 py-1 pl-6 text-xs w-full focus:border-purple-500 focus:outline-none"
                          onChange={(e) => setPanelX(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 text-xs">Y:</span>
                        <input 
                          type="text" 
                          value={panelY} 
                          className="bg-black/30 text-white border border-white/20 rounded-md px-2 py-1 pl-6 text-xs w-full focus:border-purple-500 focus:outline-none"
                          onChange={(e) => setPanelY(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 mb-1">Caption</span>
                    <input 
                      type="text" 
                      value={panelCaption}
                      placeholder="Add caption..." 
                      className="bg-black/30 text-white border border-white/20 rounded-md px-2 py-1 text-xs focus:border-purple-500 focus:outline-none"
                      onChange={(e) => setPanelCaption(e.target.value)}
                    />
                  </div>
                  
                  {/* Opacity slider */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-white/50">Opacity</span>
                      <span className="text-[10px] text-white/70">100%</span>
                    </div>
                    <Slider
                      defaultValue={[100]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end mt-1">
                    <Button 
                      size="sm"
                      onClick={handleSaveProperties}
                      className="text-xs h-7 px-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:opacity-90 rounded-md shadow-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Layout Templates */}
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-white/60 text-xs mb-2 font-medium">Layout Templates</div>
              <div className="grid grid-cols-2 gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="p-1 bg-black/30 hover:bg-black/50 rounded-md border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="aspect-video bg-purple-900/20 flex items-center justify-center rounded-sm">
                    <div className="w-full flex gap-1 p-1">
                      <div className="w-1/2 bg-white/20 aspect-square rounded-sm"></div>
                      <div className="w-1/2 flex flex-col gap-1">
                        <div className="h-1/2 bg-white/20 rounded-sm"></div>
                        <div className="h-1/2 bg-white/20 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-white/70 text-xs mt-1 text-center hover:text-white">2x2 Grid</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="p-1 bg-black/30 hover:bg-black/50 rounded-md border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="aspect-video bg-purple-900/20 flex items-center justify-center rounded-sm">
                    <div className="w-full flex flex-col gap-1 p-1">
                      <div className="h-1/2 bg-white/20 rounded-sm"></div>
                      <div className="h-1/2 flex gap-1">
                        <div className="w-1/3 bg-white/20 rounded-sm"></div>
                        <div className="w-2/3 bg-white/20 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-white/70 text-xs mt-1 text-center hover:text-white">Split View</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="p-1 bg-black/30 hover:bg-black/50 rounded-md border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="aspect-video bg-purple-900/20 flex items-center justify-center rounded-sm">
                    <div className="w-full grid grid-cols-3 gap-1 p-1">
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                      <div className="bg-white/20 aspect-square rounded-sm"></div>
                    </div>
                  </div>
                  <div className="text-white/70 text-xs mt-1 text-center hover:text-white">3x2 Grid</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="p-1 bg-black/30 hover:bg-black/50 rounded-md border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="aspect-video bg-purple-900/20 flex items-center justify-center rounded-sm">
                    <div className="w-full grid grid-rows-2 grid-cols-[2fr_1fr] gap-1 p-1 h-full">
                      <div className="bg-white/20 row-span-2 rounded-sm"></div>
                      <div className="bg-white/20 rounded-sm"></div>
                      <div className="bg-white/20 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="text-white/70 text-xs mt-1 text-center hover:text-white">Focus Panel</div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer section */}
        <div className="mt-auto border-t border-white/10 p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
            >
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Help
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:opacity-90 text-xs h-8 shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              onClick={handleExportLayout}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Layout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

// Editor tool button component with enhanced styling
function EditorToolButton({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button 
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-all", 
              isActive 
                ? "bg-gradient-to-br from-purple-600/30 to-purple-700/20 hover:from-purple-600/40 hover:to-purple-700/30 text-white/90 border border-purple-500/30" 
                : "bg-black/30 hover:bg-black/40 text-white/60 hover:text-white/90 border border-transparent hover:border-white/20"
            )}
            aria-pressed={isActive}
          >
            {icon}
            <span className="text-[10px] mt-1">{label}</span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {label} tool {isActive ? '(active)' : ''}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}