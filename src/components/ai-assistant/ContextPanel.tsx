// src/components/ai-assistant/ContextPanel.tsx

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlusCircle, Book, User, MapPin, Palette, MessageSquare, Lightbulb } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ContextPanel: React.FC<{ activePersona: any }> = ({ activePersona }) => {
  const [linkedItems, setLinkedItems] = useState({
    characters: 2,
    scenes: 1,
    chapters: 1
  });
  
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02]" style={{ borderColor: `${activePersona.primaryColor}20` }}>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Context Awareness</h3>
            <Switch defaultChecked id="context-toggle" />
          </div>
          <p className="text-xs text-white/60">
            Enable {activePersona.name} to access your project data for more relevant suggestions.
          </p>
        </div>
        
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium text-white">Linked Items</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-white/10 rounded-md">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                <span className="text-sm text-white">Characters</span>
              </div>
              <Badge variant="outline" className="bg-white/5">{linkedItems.characters}</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 px-3 bg-white/10 rounded-md">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-sm text-white">Scenes & Backgrounds</span>
              </div>
              <Badge variant="outline" className="bg-white/5">{linkedItems.scenes}</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 px-3 bg-white/10 rounded-md">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-green-500" />
                <span className="text-sm text-white">Chapters</span>
              </div>
              <Badge variant="outline" className="bg-white/5">{linkedItems.chapters}</Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-2 gap-1 border-white/20 text-white/80 hover:text-white hover:bg-white/10"
            style={{ borderColor: `${activePersona.primaryColor}30` }}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Link More Items
          </Button>
        </div>
        
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium text-white">{activePersona.name}'s Specialties</h3>
          
          <div className="space-y-2">
            {activePersona.id === 'sensei' && (
              <>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Artistic Techniques</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Panel Composition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Visual Storytelling</span>
                </div>
              </>
            )}
            
            {activePersona.id === 'nova' && (
              <>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Story Structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Character Arcs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Plot Development</span>
                </div>
              </>
            )}
            
            {activePersona.id === 'hiro' && (
              <>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Digital Tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Special Effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Technical Processes</span>
                </div>
              </>
            )}
            
            {activePersona.id === 'yuki' && (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Character Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Expressions & Emotions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" style={{ color: activePersona.primaryColor }} />
                  <span className="text-sm text-white/80">Visual Character Development</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextPanel;