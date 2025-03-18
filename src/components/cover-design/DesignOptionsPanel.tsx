import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  GalleryHorizontalEnd, 
  Type, 
  Palette, 
  Sparkles, 
  Crown, 
  BookOpen,
  Wand2,
  Loader2
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DesignOptionsPanelProps {
  settings: any;
  updateSettings: (newSettings: any) => void;
  templates: any[];
  applyTemplate: (templateId: string) => void;
  isGenerating: boolean;
}

// Font family options
const fontOptions = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'monospace', label: 'Monospace' },
];

// Layout options
const layoutOptions = [
  { value: 'centered', label: 'Centered' },
  { value: 'asymmetric', label: 'Asymmetric' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'futuristic', label: 'Futuristic' },
];

// Effects options
const effectOptions = [
  { value: 'glow', label: 'Glow Effect' },
  { value: 'texture', label: 'Texture Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'particles', label: 'Particles' },
  { value: 'magical', label: 'Magical Aura' },
  { value: 'depth', label: 'Depth Effect' },
  { value: 'glitch', label: 'Glitch Effect' },
  { value: 'hologram', label: 'Hologram Effect' },
];

// Text effects options
const textEffectOptions = [
  { value: 'shadow', label: 'Shadow' },
  { value: 'glow', label: 'Glow' },
  { value: 'outline', label: 'Outline' },
  { value: 'gradient', label: 'Color Gradient' },
  { value: 'metallic', label: 'Metallic' },
];

export default function DesignOptionsPanel({ 
  settings, 
  updateSettings, 
  templates,
  applyTemplate,
  isGenerating
}: DesignOptionsPanelProps) {
  const [designTab, setDesignTab] = useState('content');
  
  const toggleEffect = (effect: string) => {
    const effects = [...settings.effects];
    if (effects.includes(effect)) {
      updateSettings({ effects: effects.filter(e => e !== effect) });
    } else {
      updateSettings({ effects: [...effects, effect] });
    }
  };
  
  const toggleTextEffect = (effect: string) => {
    const effects = [...settings.textEffects];
    if (effects.includes(effect)) {
      updateSettings({ textEffects: effects.filter(e => e !== effect) });
    } else {
      updateSettings({ textEffects: [...effects, effect] });
    }
  };
  
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02]">
      <CardContent className="p-4">
        <Tabs value={designTab} onValueChange={setDesignTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="templates">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="content">
              <Type className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Style</span>
            </TabsTrigger>
            <TabsTrigger value="effects">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Effects</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className="border border-white/10 rounded-lg overflow-hidden cursor-pointer group hover:border-primary/50 transition-all"
                  onClick={() => applyTemplate(template.id)}
                >
                  <div className="h-32 bg-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <img 
                      src={template.thumbnail || `https://source.unsplash.com/random/300x500/?manga,${template.name}`} 
                      alt={template.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-medium">{template.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pro templates (locked) */}
              <div className="border border-white/10 rounded-lg overflow-hidden relative group">
                <div className="h-32 bg-gray-900 relative overflow-hidden opacity-60">
                  <img 
                    src="https://source.unsplash.com/random/300x500/?manga,horror" 
                    alt="Horror Template" 
                    className="w-full h-full object-cover blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <h3 className="text-white font-medium">Horror</h3>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    <Crown className="h-3 w-3 mr-1" /> Pro
                  </Badge>
                </div>
              </div>
              
              <div className="border border-white/10 rounded-lg overflow-hidden relative group">
                <div className="h-32 bg-gray-900 relative overflow-hidden opacity-60">
                  <img 
                    src="https://source.unsplash.com/random/300x500/?manga,comedy" 
                    alt="Comedy Template" 
                    className="w-full h-full object-cover blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <h3 className="text-white font-medium">Comedy</h3>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    <Crown className="h-3 w-3 mr-1" /> Pro
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              >
                <Crown className="h-4 w-4" />
                Unlock Pro Templates
              </Button>
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/80">Cover Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => updateSettings({ title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-white/80">Subtitle</Label>
              <Input
                id="subtitle"
                value={settings.subtitle}
                onChange={(e) => updateSettings({ subtitle: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author" className="text-white/80">Author Name</Label>
              <Input
                id="author"
                value={settings.authorName}
                onChange={(e) => updateSettings({ authorName: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Optional"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Layout</Label>
              <Select
                value={settings.layout}
                onValueChange={(layout) => updateSettings({ layout })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent className="bg-background/90 border-white/20">
                  {layoutOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Cover Illustration</Label>
              <div className="flex gap-2">
                <Input
                  value={settings.illustrationPrompt || ''}
                  onChange={(e) => updateSettings({ illustrationPrompt: e.target.value })}
                  className="bg-white/10 border-white/20 text-white flex-1"
                  placeholder="Describe your cover image"
                />
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 gap-1"
                  disabled={isGenerating || !settings.illustrationPrompt}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Generate</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/60">
                Describe what you want on your cover, or switch to the AI Assistant tab for more options.
              </p>
            </div>
          </TabsContent>
          
          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-white/80">Font</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(fontFamily) => updateSettings({ fontFamily })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent className="bg-background/90 border-white/20">
                  {fontOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} style={{ fontFamily: option.value }}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Background Color</Label>
                <div className="flex h-5 items-center space-x-2">
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                    className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-white/20"
                    style={{ backgroundColor: settings.backgroundColor }}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Title Color</Label>
                <div className="flex h-5 items-center space-x-2">
                  <input
                    type="color"
                    value={settings.titleColor}
                    onChange={(e) => updateSettings({ titleColor: e.target.value })}
                    className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-white/20"
                    style={{ backgroundColor: settings.titleColor }}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Subtitle Color</Label>
                <div className="flex h-5 items-center space-x-2">
                  <input
                    type="color"
                    value={settings.subtitleColor}
                    onChange={(e) => updateSettings({ subtitleColor: e.target.value })}
                    className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-white/20"
                    style={{ backgroundColor: settings.subtitleColor }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4 pt-4">
            <ScrollArea className="h-[300px] pr-4 -mr-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-white/80 mb-2 block">Visual Effects</Label>
                  <div className="space-y-2">
                    {effectOptions.map(effect => (
                      <div key={effect.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`effect-${effect.value}`}
                          checked={settings.effects.includes(effect.value)}
                          onCheckedChange={() => toggleEffect(effect.value)}
                          className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label 
                          htmlFor={`effect-${effect.value}`}
                          className="text-sm text-white/80"
                        >
                          {effect.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-white/80 mb-2 block">Text Effects</Label>
                  <div className="space-y-2">
                    {textEffectOptions.map(effect => (
                      <div key={effect.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`text-effect-${effect.value}`}
                          checked={settings.textEffects.includes(effect.value)}
                          onCheckedChange={() => toggleTextEffect(effect.value)}
                          className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label 
                          htmlFor={`text-effect-${effect.value}`}
                          className="text-sm text-white/80"
                        >
                          {effect.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}