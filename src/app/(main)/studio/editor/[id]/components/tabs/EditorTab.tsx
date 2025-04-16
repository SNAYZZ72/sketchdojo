"use client";

import React, { useState } from 'react';
import { 
  Edit3, 
  Image as ImageIcon, 
  Layers, 
  Layout, 
  Grid, 
  PanelLeft, 
  PanelRight, 
  Maximize, 
  LayoutGrid, 
  Brush, 
  Type, 
  Speech, 
  Shapes, 
  Zap, 
  Play, 
  Save, 
  Download, 
  History, 
  Undo, 
  Redo,
  Settings,
  HelpCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Image from 'next/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditorTabProps {
  projectId: string;
}

// Tool button component
interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const ToolButton = ({ icon, label, onClick, active = false, disabled = false }: ToolButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-10 w-10 rounded-md ${
            active 
              ? 'bg-sketchdojo-primary/20 text-sketchdojo-primary border border-sketchdojo-primary/30' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Mock page thumbnail component
interface PageThumbnailProps {
  pageNumber: number;
  isActive?: boolean;
  onClick: () => void;
}

const PageThumbnail = ({ pageNumber, isActive = false, onClick }: PageThumbnailProps) => (
  <div 
    className={`group relative border ${isActive ? 'border-sketchdojo-primary' : 'border-white/20'} rounded-md overflow-hidden mb-3 cursor-pointer transition-all duration-200 hover:border-sketchdojo-primary/70 ${isActive ? 'ring-2 ring-sketchdojo-primary/30' : ''}`}
    onClick={onClick}
  >
    <div className="aspect-[2/3] bg-black/30 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-sketchdojo-bg-light to-sketchdojo-bg opacity-80"></div>
      <div className="relative z-10 font-medium text-white/40 text-sm">Page {pageNumber}</div>
    </div>
    <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
      {pageNumber}
    </div>
  </div>
);

// Canvas component with mock manga panel
const EditorCanvas = () => (
  <div className="relative flex-1 bg-[#0A0A0A] border border-white/10 rounded-md overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Mock grid guides */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute left-0 right-0 h-px bg-white/10" style={{ top: `${(i * 100) / 6}%` }}></div>
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${(i * 100) / 6}%` }}></div>
        ))}
      </div>

      {/* Mock manga panel layout */}
      <div className="w-[70%] h-[80%] relative">
        {/* Panel 1 */}
        <div className="absolute top-0 left-0 w-[60%] h-[60%] border-4 border-white/20 bg-black/40 rounded-md flex items-center justify-center">
          <div className="text-white/50 text-lg">Panel 1</div>
        </div>
        
        {/* Panel 2 */}
        <div className="absolute top-0 right-0 w-[35%] h-[35%] border-4 border-white/20 bg-black/40 rounded-md flex items-center justify-center">
          <div className="text-white/50 text-lg">Panel 2</div>
        </div>
        
        {/* Panel 3 */}
        <div className="absolute bottom-0 right-0 w-[60%] h-[35%] border-4 border-white/20 bg-black/40 rounded-md flex items-center justify-center">
          <div className="text-white/50 text-lg">Panel 3</div>
        </div>
        
        {/* Panel 4 */}
        <div className="absolute top-[40%] right-0 w-[35%] h-[20%] border-4 border-white/20 bg-black/40 rounded-md flex items-center justify-center">
          <div className="text-white/50 text-lg">Panel 4</div>
        </div>
        
        {/* Active panel with selection indicator */}
        <div className="absolute bottom-0 left-0 w-[35%] h-[35%] border-4 border-sketchdojo-primary bg-black/40 rounded-md flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-sketchdojo-primary/10"></div>
          <div className="text-white/90 text-lg z-10">Panel 5</div>
          
          {/* Selection handles */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-sketchdojo-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-nw-resize"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-sketchdojo-primary rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-ne-resize"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-sketchdojo-primary rounded-full transform -translate-x-1/2 translate-y-1/2 cursor-sw-resize"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-sketchdojo-primary rounded-full transform translate-x-1/2 translate-y-1/2 cursor-se-resize"></div>
        </div>
        
        {/* Mock speech bubble */}
        <div className="absolute top-[15%] left-[30%] bg-white rounded-lg p-3 transform -rotate-3 w-[200px] shadow-lg">
          <div className="text-black text-sm font-comic">
            What hidden powers lie within these ancient scrolls?
          </div>
          <div className="absolute -bottom-5 -left-2 w-10 h-10 bg-white transform rotate-45"></div>
        </div>
      </div>
    </div>
  </div>
);

// Main editor component
export function EditorTab({ projectId }: EditorTabProps) {
  const [editorActive, setEditorActive] = useState(false);
  const [currentTool, setCurrentTool] = useState('select');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Handle launching the editor
  const handleLaunchEditor = () => {
    setEditorActive(true);
    toast.success("Visual Editor launched", {
      description: "You can now edit your manga panels"
    });
  };
  
  // Handle tool selection
  const handleSelectTool = (tool: string) => {
    setCurrentTool(tool);
    toast.info(`Tool: ${tool} selected`);
  };
  
  // Handle saving the project
  const handleSave = () => {
    toast.success("Project saved successfully!");
  };
  
  // Handle exporting the project
  const handleExport = () => {
    toast.info("Preparing to export project...");
  };
  
  // Handle page selection
  const handleSelectPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // If editor is not launched, show launch screen
  if (!editorActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto"
        >
          <div className="mb-8 relative">
            <div className="absolute -inset-10 bg-sketchdojo-primary/10 rounded-full blur-3xl opacity-50"></div>
            <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 flex items-center justify-center relative">
              <Edit3 className="h-12 w-12 text-sketchdojo-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 text-white">Visual Editor</h2>
          <p className="text-white/60 mb-8 text-lg max-w-md mx-auto">
            Create stunning manga panels with our advanced editor. Design layouts, add speech bubbles, and bring your story to life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/10 transition-colors">
              <Layout className="h-8 w-8 text-sketchdojo-primary mb-3" />
              <h3 className="font-medium text-white mb-1">Panel Layouts</h3>
              <p className="text-white/60 text-sm">Create dynamic panel layouts for visual storytelling</p>
            </Card>
            
            <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/10 transition-colors">
              <Speech className="h-8 w-8 text-sketchdojo-primary mb-3" />
              <h3 className="font-medium text-white mb-1">Speech Bubbles</h3>
              <p className="text-white/60 text-sm">Add dialogue with customizable speech bubbles</p>
            </Card>
            
            <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/10 transition-colors">
              <Zap className="h-8 w-8 text-sketchdojo-primary mb-3" />
              <h3 className="font-medium text-white mb-1">Effects & Tones</h3>
              <p className="text-white/60 text-sm">Enhance your manga with effects and screen tones</p>
            </Card>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:shadow-lg hover:shadow-sketchdojo-primary/30 text-white transition-all duration-300 px-8 py-6 text-lg"
            onClick={handleLaunchEditor}
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Launch Editor
          </Button>
        </motion.div>
      </div>
    );
  }
  
  // If editor is active, show the editor interface
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Top toolbar */}
      <div className="bg-sketchdojo-bg-light/95 backdrop-blur-md border-b border-white/10 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-9"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-9"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
          
          <ToolButton
            icon={<Undo className="h-4 w-4" />}
            label="Undo"
            onClick={() => toast.info("Undo action")}
          />
          
          <ToolButton
            icon={<Redo className="h-4 w-4" />}
            label="Redo"
            onClick={() => toast.info("Redo action")}
          />
          
          <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
          
          <Select 
            value="page-1" 
            onValueChange={() => {}}
          >
            <SelectTrigger className="w-[180px] h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Page 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page-1">Page 1</SelectItem>
              <SelectItem value="page-2">Page 2</SelectItem>
              <SelectItem value="page-3">Page 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => toast.info("Zoom out")}
            >
              <span className="text-xl font-bold">-</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Slider
                value={[zoomLevel]}
                min={25}
                max={200}
                step={5}
                className="w-28"
                onValueChange={(value) => setZoomLevel(value[0])}
              />
              <span className="text-white/80 text-xs w-12">{zoomLevel}%</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => toast.info("Zoom in")}
            >
              <span className="text-xl font-bold">+</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Eye className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Play className="h-5 w-5" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
          
          <Badge variant="outline" className="bg-white/5 text-white border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Auto-saved 2m ago</span>
            </div>
          </Badge>
        </div>
      </div>
      
      {/* Main editor area */}
      <div className="flex-1 flex">
        {/* Left sidebar: Pages */}
        <div className="w-20 border-r border-white/10 bg-sketchdojo-bg-light/80 p-2">
          <div className="text-white/60 text-xs font-medium mb-2 px-1">PAGES</div>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="pr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <PageThumbnail 
                  key={i}
                  pageNumber={i + 1}
                  isActive={currentPage === i + 1}
                  onClick={() => handleSelectPage(i + 1)}
                />
              ))}
              
              {/* Add page button */}
              <Button
                variant="ghost" 
                className="w-full h-16 border border-dashed border-white/20 rounded-md text-white/40 hover:text-white hover:bg-white/5 hover:border-white/30"
              >
                + Add Page
              </Button>
            </div>
          </ScrollArea>
        </div>
        
        {/* Left toolbar */}
        <div className="w-12 bg-sketchdojo-bg-light/90 border-r border-white/10 p-2 flex flex-col items-center gap-2">
          <ToolButton
            icon={<Layers className="h-4 w-4" />}
            label="Selection Tool"
            onClick={() => handleSelectTool('select')}
            active={currentTool === 'select'}
          />
          
          <ToolButton
            icon={<LayoutGrid className="h-4 w-4" />}
            label="Panel Tool"
            onClick={() => handleSelectTool('panel')}
            active={currentTool === 'panel'}
          />
          
          <ToolButton
            icon={<ImageIcon className="h-4 w-4" />}
            label="Image Tool"
            onClick={() => handleSelectTool('image')}
            active={currentTool === 'image'}
          />
          
          <ToolButton
            icon={<Type className="h-4 w-4" />}
            label="Text Tool"
            onClick={() => handleSelectTool('text')}
            active={currentTool === 'text'}
          />
          
          <ToolButton
            icon={<Speech className="h-4 w-4" />}
            label="Speech Bubble Tool"
            onClick={() => handleSelectTool('speech')}
            active={currentTool === 'speech'}
          />
          
          <ToolButton
            icon={<Brush className="h-4 w-4" />}
            label="Brush Tool"
            onClick={() => handleSelectTool('brush')}
            active={currentTool === 'brush'}
          />
          
          <ToolButton
            icon={<Shapes className="h-4 w-4" />}
            label="Shape Tool"
            onClick={() => handleSelectTool('shape')}
            active={currentTool === 'shape'}
          />
          
          <ToolButton
            icon={<Zap className="h-4 w-4" />}
            label="Effects Tool"
            onClick={() => handleSelectTool('effects')}
            active={currentTool === 'effects'}
          />
          
          <div className="flex-1"></div>
          
          <ToolButton
            icon={<Settings className="h-4 w-4" />}
            label="Editor Settings"
            onClick={() => toast.info("Editor settings")}
          />
          
          <ToolButton
            icon={<HelpCircle className="h-4 w-4" />}
            label="Help"
            onClick={() => toast.info("Editor help")}
          />
        </div>
        
        {/* Canvas area */}
        <EditorCanvas />
        
        {/* Right properties panel */}
        <div className="w-64 border-l border-white/10 bg-sketchdojo-bg-light/80 p-3">
          <div className="text-white/80 font-medium mb-2">Panel Properties</div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Position</label>
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">X</span>
                  <input type="text" value="120" className="w-full bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">Y</span>
                  <input type="text" value="320" className="w-full bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Size</label>
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">W</span>
                  <input type="text" value="180" className="w-full bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">H</span>
                  <input type="text" value="220" className="w-full bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Border</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1">
                  <option>Solid</option>
                  <option>Dashed</option>
                  <option>None</option>
                </select>
                <input type="text" value="4" className="w-16 bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Background</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-black"></div>
                <input type="text" value="#000000" className="flex-1 bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Layering</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs text-white/70 border-white/10 hover:bg-white/10">
                  Bring Forward
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs text-white/70 border-white/10 hover:bg-white/10">
                  Send Back
                </Button>
              </div>
            </div>
            
            <Separator className="bg-white/10 my-4" />
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Effects</label>
              <select className="w-full bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1">
                <option>None</option>
                <option>Drop Shadow</option>
                <option>Glow</option>
                <option>Halftone</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-white/60 text-xs">Panel Notes</label>
              <textarea className="w-full h-20 bg-white/5 border border-white/10 rounded text-white text-sm px-2 py-1 resize-none" placeholder="Add notes about this panel..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}