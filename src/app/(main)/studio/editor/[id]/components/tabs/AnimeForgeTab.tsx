// src/app/(main)/studio/editor/[id]/components/tabs/AnimeForgeTab.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Wand2, 
  Sliders, 
  CheckCircle2,
  ImageIcon,
  Palette,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Style preset type
interface StylePreset {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
}

// Mock data for style presets with improved descriptions
const stylePresets: StylePreset[] = [
  { 
    id: 'anime-forge', 
    name: 'Anime Forge', 
    shortDescription: 'Default AI-powered anime style',
    description: 'Quintessential 2D anime style, perfect for immersive anime-like stories, webtoons, and vibrant character-driven narratives.',
    imageUrl: '/styles/anime-forge.jpg' 
  },
  { 
    id: 'studio-ghibli', 
    name: 'Studio Ghibli', 
    shortDescription: 'Inspired by Studio Ghibli films',
    description: 'Warm, painterly style with detailed natural environments, gentle lighting, and expressive characters reminiscent of beloved Ghibli classics.',
    imageUrl: '/styles/ghibli.jpg' 
  },
  { 
    id: 'modern-manga', 
    name: 'Modern Manga', 
    shortDescription: 'Contemporary manga aesthetic',
    description: 'Sharp, high-contrast black and white style with dynamic panels, speed lines, and expressive character designs following modern manga conventions.',
    imageUrl: '/styles/modern-manga.jpg' 
  },
  { 
    id: 'classic-anime', 
    name: 'Classic Anime', 
    shortDescription: 'Nostalgic 90s anime look',
    description: 'Nostalgic 90s anime aesthetic with cell animation feel, bold colors, and memorable character designs that evoke the golden age of anime.',
    imageUrl: '/styles/classic-anime.jpg' 
  },
  { 
    id: 'noir-comix', 
    name: 'Noir Comix', 
    shortDescription: 'Dark, dramatic noir styling',
    description: 'High-contrast black and white with moody shadows, cinematic angles, and dramatic lighting perfect for mysteries and thrillers.',
    imageUrl: '/styles/noir-comix.jpg' 
  },
  { 
    id: 'shounen', 
    name: 'Shounen Style', 
    shortDescription: 'Bold action-oriented style',
    description: 'Dynamic, high-energy style with intense action scenes, dramatic expressions, and vibrant effects perfect for battle and adventure stories.',
    imageUrl: '/styles/shounen.jpg' 
  },
  { 
    id: 'shoujo', 
    name: 'Shoujo Style', 
    shortDescription: 'Romantic and emotional aesthetic',
    description: 'Gentle, expressive style with flowing lines, decorative elements, and emotional character designs ideal for romance and drama.',
    imageUrl: '/styles/shoujo.jpg' 
  },
  { 
    id: 'chibi', 
    name: 'Chibi Style', 
    shortDescription: 'Cute and exaggerated proportions',
    description: 'Adorable super-deformed style with large heads, small bodies, and simplified features perfect for comedy and cute moments.',
    imageUrl: '/styles/chibi.jpg' 
  },
];

interface AnimeForgeTabProps {
  projectId: string;
}

export function AnimeForgeTab({ projectId }: AnimeForgeTabProps) {
  const [currentStyle, setCurrentStyle] = useState<StylePreset>(stylePresets[0]);
  const [lineWeight, setLineWeight] = useState<number>(5);
  const [saturation, setSaturation] = useState<number>(70);
  const [detailLevel, setDetailLevel] = useState<number>(7);
  const [shadingStyle, setShadingStyle] = useState<string>('Cell Shading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const handleStyleChange = (styleId: string) => {
    const selectedStyle = stylePresets.find(style => style.id === styleId);
    if (selectedStyle) {
      setCurrentStyle(selectedStyle);
      toast.success(`Style changed to ${selectedStyle.name}`);
    }
  };
  
  const handleApplyStyle = () => {
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      toast.success(`Applied ${currentStyle.name} style to your project`, {
        description: "All panels will update to reflect the new style",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    }, 1500);
  };
  
  const handleGeneratePreview = () => {
    setIsGenerating(true);
    // Simulate preview generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Preview generated successfully", {
        description: "Applied current style settings to the preview",
      });
    }, 2000);
  };
  
  const handleApplySettings = () => {
    toast.success('Style settings applied successfully');
  };
  
  const handleStyleSelect = (preset: StylePreset, index: number) => {
    setCurrentStyle(preset);
    setCurrentIndex(index);
    toast.success(`Selected ${preset.name} style`);
  };
  
  const nextStyle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stylePresets.length);
    setCurrentStyle(stylePresets[(currentIndex + 1) % stylePresets.length]);
  };
  
  const prevStyle = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stylePresets.length) % stylePresets.length);
    setCurrentStyle(stylePresets[(currentIndex - 1 + stylePresets.length) % stylePresets.length]);
  };
  
  // Render style selection modal
  const StyleSelectionModal = () => (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowStyleModal(false)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </div>
      
      <div className="max-w-6xl w-full flex flex-col items-center">
        <h2 className="text-white text-2xl font-bold mb-12">Select Style</h2>
        
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={prevStyle}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={nextStyle}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div ref={carouselRef} className="flex justify-center items-center relative px-16">
            {stylePresets.map((style, index) => {
              // Calculate distance from center to determine size and opacity
              const isCenter = index === currentIndex;
              const distance = Math.min(Math.abs(index - currentIndex), 
                Math.abs(index - currentIndex - stylePresets.length),
                Math.abs(index - currentIndex + stylePresets.length));
              
              const displayIndex = ((index - currentIndex) + stylePresets.length) % stylePresets.length;
              const isVisible = displayIndex <= 2 || displayIndex >= stylePresets.length - 2;
              
              if (!isVisible) return null;
              
              return (
                <motion.div
                  key={style.id}
                  className={cn(
                    "rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer",
                    isCenter 
                      ? "border-primary/80 border-2 shadow-lg shadow-primary/20" 
                      : "border-white/20"
                  )}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: isCenter ? 1 : 0.8 - (0.1 * distance), 
                    opacity: isCenter ? 1 : 0.7 - (0.2 * distance),
                    zIndex: isCenter ? 10 : 5 - distance,
                    x: isCenter ? 0 : (index < currentIndex ? -280 * distance : 280 * distance),
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => handleStyleSelect(style, index)}
                >
                  <div className="relative w-[600px] md:w-[800px] overflow-hidden bg-black/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
                      {/* Mock style preview with different panels */}
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-800 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-white/20" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-black/70 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{style.name}</h3>
                        {isCenter && (
                          <div className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium tracking-wider">
                            SELECTED STYLE
                          </div>
                        )}
                      </div>
                      <p className="text-white/70 mt-1 text-sm">{style.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-8 space-x-1">
          {stylePresets.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-white/30'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentStyle(stylePresets[index]);
              }}
            />
          ))}
        </div>
        
        <Button 
          className="mt-8 bg-primary hover:bg-primary/90 text-white px-12 py-6 h-auto text-lg"
          onClick={() => setShowStyleModal(false)}
        >
          Next
        </Button>
      </div>
    </div>
  );
  
  return (
    <>
      {showStyleModal && <StyleSelectionModal />}
      
      <div className="flex flex-col h-full bg-background/95">
        <div className="flex p-4 md:p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Anime Forge</h2>
              <p className="text-white/60 text-sm">AI-powered style customization</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowStyleModal(true)}
              className="border-white/20 hover:border-primary/50 hover:bg-primary/5"
            >
              <Palette className="h-4 w-4 mr-2" />
              Change Style
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
              onClick={handleApplyStyle}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Apply Style
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-4 md:p-6">
          <div className="xl:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">Style Preview</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs border-white/20">
                    {currentStyle.name} <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-white/10">
                  {stylePresets.map(style => (
                    <DropdownMenuItem 
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={cn(
                        "flex items-center",
                        currentStyle.id === style.id && "bg-primary/10 text-primary"
                      )}
                    >
                      {style.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Card className="overflow-hidden border-white/10 bg-black/30">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/40 to-black/20">
                    {isGenerating ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-3"></div>
                        <p className="text-white/70">Generating preview...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center p-6">
                        <ImageIcon className="h-10 w-10 text-white/20 mb-4" />
                        <h3 className="text-lg font-medium text-white/90 mb-1">{currentStyle.name}</h3>
                        <p className="text-white/60 max-w-md mb-4">{currentStyle.description}</p>
                        <Button
                          variant="outline"
                          className="border-white/20 bg-black/30 hover:bg-black/50 text-white"
                          onClick={handleGeneratePreview}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Preview
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/10 bg-black/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">Style Analysis</h4>
                      <p className="text-xs text-white/60">Analyzing visual characteristics...</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 w-8 rounded-full ${i < 4 ? 'bg-primary' : 'bg-white/20'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stylePresets.slice(0, 4).map(preset => (
                <Card 
                  key={preset.id}
                  className={cn(
                    "overflow-hidden cursor-pointer transition-all group hover:shadow-md",
                    currentStyle.id === preset.id 
                      ? "border-primary/70 bg-primary/5" 
                      : "border-white/10 bg-black/20 hover:border-white/30"
                  )}
                  onClick={() => handleStyleChange(preset.id)}
                >
                  <CardContent className="p-0">
                    <div className="h-32 bg-black/50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-white/20" />
                      </div>
                      
                      {currentStyle.id === preset.id && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-primary/90 text-white text-[10px] px-2 py-0.5 rounded-full">
                            ACTIVE
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-2 border-t border-white/10">
                      <p className="font-medium text-sm">{preset.name}</p>
                      <p className="text-white/60 text-xs truncate">{preset.shortDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">Style Settings</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Sliders className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Advanced Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Card className="border-white/10 bg-black/30">
              <CardContent className="p-4 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Line Weight</label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/80">{lineWeight}/10</span>
                  </div>
                  <Slider
                    value={[lineWeight]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setLineWeight(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Fine</span>
                    <span>Bold</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Color Saturation</label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/80">{saturation}%</span>
                  </div>
                  <Slider
                    value={[saturation]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSaturation(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Muted</span>
                    <span>Vibrant</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Detail Level</label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/80">{detailLevel}/10</span>
                  </div>
                  <Slider
                    value={[detailLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setDetailLevel(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Simple</span>
                    <span>Complex</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shading Style</label>
                  <Select value={shadingStyle} onValueChange={setShadingStyle}>
                    <SelectTrigger className="w-full bg-black/50 border-white/20 text-white focus:ring-primary/30">
                      <SelectValue placeholder="Select a shading style" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur border-white/10">
                      <SelectItem value="Cell Shading">Cell Shading</SelectItem>
                      <SelectItem value="Gradient Shading">Gradient Shading</SelectItem>
                      <SelectItem value="Hatching">Hatching</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleApplySettings}
                  >
                    Apply Settings
                  </Button>
                  
                  <p className="text-center text-xs text-white/40 mt-3">
                    Settings will be applied to the current style only
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-white/10 bg-primary/5 mt-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">AI Style Enhancement</h4>
                    <p className="text-sm text-white/60 mb-3">
                      Let AI analyze your style settings and suggest optimal parameters for your specific manga style.
                    </p>
                    <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                      Analyze & Optimize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}