import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image as ImageIcon, BookOpen } from 'lucide-react';

interface CoverPreviewProps {
  settings: {
    title: string;
    subtitle: string;
    authorName: string;
    backgroundColor: string;
    titleColor: string;
    subtitleColor: string;
    fontFamily: string;
    layout: string;
    illustration: string | null;
    effects: string[];
    textEffects: string[];
  };
  generatedCovers: string[];
  selectedCover: string | null;
  setSelectedCover: (cover: string | null) => void;
}

export default function CoverPreview({ 
  settings, 
  generatedCovers, 
  selectedCover, 
  setSelectedCover 
}: CoverPreviewProps) {
  const [viewMode, setViewMode] = useState<'front' | 'spine' | '3d'>('front');
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Handle cover appearance based on settings
  const getCoverStyle = () => {
    const style: React.CSSProperties = {
      backgroundColor: settings.backgroundColor,
      fontFamily: settings.fontFamily,
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    };
    
    // Add effects
    if (settings.effects.includes('glow')) {
      style.boxShadow = `0 0 30px rgba(86, 103, 255, 0.5), ${style.boxShadow}`;
    }
    
    if (settings.effects.includes('texture')) {
      style.backgroundImage = 'url(/assets/textures/paper.png)';
      style.backgroundBlendMode = 'overlay';
      style.backgroundSize = 'cover';
    }
    
    if (settings.effects.includes('soft-light')) {
      style.backgroundImage = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)';
    }
    
    return style;
  };
  
  // Get layout style based on settings
  const getLayoutStyle = () => {
    switch (settings.layout) {
      case 'centered':
        return 'flex flex-col items-center justify-center text-center';
      case 'asymmetric':
        return 'flex flex-col items-start justify-end p-8';
      case 'dynamic':
        return 'flex flex-col items-center justify-end pb-8';
      case 'futuristic':
        return 'flex flex-col items-end justify-between p-8';
      default:
        return 'flex flex-col items-center justify-center text-center';
    }
  };
  
  // Get title style based on settings
  const getTitleStyle = () => {
    const style: React.CSSProperties = {
      color: settings.titleColor,
      maxWidth: '90%',
    };
    
    // Add text effects
    if (settings.textEffects.includes('shadow')) {
      style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
    
    if (settings.textEffects.includes('glow')) {
      style.textShadow = `0 0 10px ${settings.titleColor}80, 0 0 20px ${settings.titleColor}40`;
    }
    
    if (settings.textEffects.includes('outline')) {
      style.WebkitTextStroke = '1px rgba(0, 0, 0, 0.5)';
    }
    
    return style;
  };
  
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] h-full">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">Cover Preview</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant={viewMode === 'front' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('front')}
              className="border-white/20 text-white hover:text-white"
            >
              Front
            </Button>
            <Button 
              variant={viewMode === 'spine' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('spine')}
              className="border-white/20 text-white hover:text-white"
            >
              Spine
            </Button>
            <Button 
              variant={viewMode === '3d' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('3d')}
              className="border-white/20 text-white hover:text-white"
            >
              3D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center relative">
        {/* Cover display */}
        <div 
          className={`w-full max-w-md mx-auto aspect-[2/3] relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <div 
            className={`absolute inset-0 transition-all duration-500 ${getLayoutStyle()}`}
            style={getCoverStyle()}
          >
            {/* Illustration or generated cover */}
            {selectedCover ? (
              <img 
                src={selectedCover} 
                alt="Cover Illustration" 
                className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-luminosity opacity-80" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-white/10" />
              </div>
            )}
            
            {/* Title and subtitle overlay */}
            <div className="relative z-10 px-6">
              <h1 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={getTitleStyle()}
              >
                {settings.title}
              </h1>
              
              <h2 
                className="text-xl md:text-2xl font-medium"
                style={{ color: settings.subtitleColor }}
              >
                {settings.subtitle}
              </h2>
              
              {settings.authorName && (
                <p className="mt-4 text-sm" style={{ color: settings.subtitleColor }}>
                  By {settings.authorName}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Generated covers carousel */}
        {generatedCovers.length > 0 && (
          <div className="w-full mt-8">
            <h3 className="text-sm font-medium text-white/80 mb-3">Generated Covers</h3>
            <ScrollArea className="h-24 w-full">
              <div className="flex gap-3">
                {generatedCovers.map((cover, index) => (
                  <button
                    key={index}
                    className={`h-24 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      selectedCover === cover ? 'border-primary' : 'border-transparent hover:border-white/30'
                    }`}
                    onClick={() => setSelectedCover(cover)}
                  >
                    <img 
                      src={cover} 
                      alt={`Generated cover ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}