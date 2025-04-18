'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Trash, Edit3, PlusCircle, Move, MousePointer, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePanel } from './chat-image-gallery';

interface ChatImageEditorProps {
  panels: ImagePanel[];
  zoom: number;
  selectedPanel: number | null;
  onSelectPanel: (index: number) => void;
}

/**
 * Component for editing manga panels with advanced tools
 */
export function ChatImageEditor({
  panels,
  zoom,
  selectedPanel,
  onSelectPanel
}: ChatImageEditorProps) {
  const [activeEditorTool, setActiveEditorTool] = useState<'select' | 'move' | 'add' | 'delete'>('select');

  // Function to duplicate a panel
  const handleDuplicatePanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    console.log(`Duplicating panel ${index}`);
    // Would implement actual duplication functionality here
  };

  // Function to delete a panel
  const handleDeletePanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    console.log(`Deleting panel ${index}`);
    // Would implement actual deletion functionality here
  };

  // Function to edit a panel
  const handleEditPanel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    console.log(`Editing panel ${index}`);
    // Would implement actual edit functionality here
  };

  // Empty state component for when no panels are available
  const EmptyState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-white/40 max-w-md">
        <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-black/30 flex items-center justify-center">
          <Layers className="h-10 w-10 text-white/20" />
        </div>
        <h3 className="text-white/80 text-lg mb-2">No Manga Panels Yet</h3>
        <p className="text-white/40 text-sm mb-4">
          Start a conversation in the chat to generate manga panels that you can edit here.
        </p>
        <Button 
          variant="default"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => window.history.back()} // Simple navigation back
        >
          Return to Chat
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Editor Canvas */}
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto relative p-4">
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
            <div className="w-[1200px] h-[800px] flex flex-wrap gap-4 p-8 content-start">
              {panels.length > 0 ? (
                panels.map((panel, index) => (
                  <div 
                    key={panel.id} 
                    className={cn(
                      "group border relative cursor-move", 
                      selectedPanel === index 
                        ? "border-purple-500 shadow-xl shadow-purple-500/20"
                        : "border-white/10 hover:border-white/30"
                    )}
                    style={{ width: '280px', height: '350px' }}
                    onClick={() => onSelectPanel(index)}
                  >
                    <Image 
                      src={panel.url} 
                      alt={`Panel ${panel.panelNumber}`} 
                      className="w-full h-full object-cover"
                      width={280}
                      height={350}
                      unoptimized={true}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 flex justify-between items-center">
                      <span className="text-white/80 text-xs">Panel {panel.panelNumber}</span>
                      <div className="flex gap-1">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white"
                          onClick={(e) => handleDuplicatePanel(e, index)}
                          aria-label="Duplicate panel"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-red-400"
                          onClick={(e) => handleDeletePanel(e, index)}
                          aria-label="Delete panel"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white"
                          onClick={(e) => handleEditPanel(e, index)}
                          aria-label="Edit panel"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Tools Sidebar */}
      <div className="w-64 border-l border-white/10 bg-black/50 p-3 backdrop-blur-sm flex flex-col">
        <div className="text-white/80 font-medium text-sm mb-4 pb-2 border-b border-white/10">
          Editor Tools
        </div>
        
        <div className="space-y-4">
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="text-white/60 text-xs mb-2">Tools</div>
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
            <div className="p-2 bg-black/20 rounded-lg">
              <div className="text-white/60 text-xs mb-2">Panel Properties</div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">Width</span>
                    <input 
                      type="text" 
                      value="280" 
                      className="bg-black/30 text-white border border-white/20 rounded-sm px-2 py-1 text-xs"
                      onChange={(e) => console.log('Width changed to', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">Height</span>
                    <input 
                      type="text" 
                      value="350" 
                      className="bg-black/30 text-white border border-white/20 rounded-sm px-2 py-1 text-xs"
                      onChange={(e) => console.log('Height changed to', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50">Position</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value="X: 120" 
                      className="flex-1 bg-black/30 text-white border border-white/20 rounded-sm px-2 py-1 text-xs"
                      onChange={(e) => console.log('X changed to', e.target.value)}
                    />
                    <input 
                      type="text" 
                      value="Y: 80" 
                      className="flex-1 bg-black/30 text-white border border-white/20 rounded-sm px-2 py-1 text-xs"
                      onChange={(e) => console.log('Y changed to', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50">Caption</span>
                  <input 
                    type="text" 
                    placeholder="Add caption..." 
                    className="bg-black/30 text-white border border-white/20 rounded-sm px-2 py-1 text-xs"
                    onChange={(e) => console.log('Caption changed to', e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm"
                    className="text-xs h-7 px-2 bg-purple-600 hover:bg-purple-700"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Layout Templates */}
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="text-white/60 text-xs mb-2">Layout Templates</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-1 bg-black/30 hover:bg-black/50 rounded border border-white/10 hover:border-white/30 transition-colors">
                <div className="aspect-video bg-purple-900/20 flex items-center justify-center">
                  <div className="w-full flex gap-1 p-1">
                    <div className="w-1/2 bg-white/20 aspect-square"></div>
                    <div className="w-1/2 flex flex-col gap-1">
                      <div className="h-1/2 bg-white/20"></div>
                      <div className="h-1/2 bg-white/20"></div>
                    </div>
                  </div>
                </div>
                <div className="text-white/60 text-[10px] mt-1">2x2 Grid</div>
              </button>
              
              <button className="p-1 bg-black/30 hover:bg-black/50 rounded border border-white/10 hover:border-white/30 transition-colors">
                <div className="aspect-video bg-purple-900/20 flex items-center justify-center">
                  <div className="w-full flex flex-col gap-1 p-1">
                    <div className="h-1/2 bg-white/20"></div>
                    <div className="h-1/2 flex gap-1">
                      <div className="w-1/3 bg-white/20"></div>
                      <div className="w-2/3 bg-white/20"></div>
                    </div>
                  </div>
                </div>
                <div className="text-white/60 text-[10px] mt-1">Split View</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Editor tool button component
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
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded transition-colors", 
        isActive 
          ? "bg-purple-600/20 hover:bg-purple-600/30 text-white/80" 
          : "bg-black/30 hover:bg-black/40 text-white/60"
      )}
      aria-pressed={isActive}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}