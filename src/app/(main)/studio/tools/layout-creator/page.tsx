"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Grid2X2, Grid3X3, LayoutGrid, Columns, SquareStackIcon } from "lucide-react";

// Layout presets
const layoutPresets = [
  { 
    id: 1, 
    name: "Standard 3x3", 
    image: "/placeholder-layout-1.jpg",
    description: "Classic 3x3 grid layout with equal panels"
  },
  { 
    id: 2, 
    name: "Dynamic Action", 
    image: "/placeholder-layout-2.jpg",
    description: "Varied panel sizes for dynamic action scenes"
  },
  { 
    id: 3, 
    name: "Widescreen", 
    image: "/placeholder-layout-3.jpg",
    description: "Horizontal panels for cinematic effect"
  },
  { 
    id: 4, 
    name: "Vertical Focus", 
    image: "/placeholder-layout-4.jpg",
    description: "Tall vertical panels for character focus"
  },
  { 
    id: 5, 
    name: "Splash Page", 
    image: "/placeholder-layout-5.jpg",
    description: "Single large panel with smaller detail panels"
  },
  { 
    id: 6, 
    name: "Scattered", 
    image: "/placeholder-layout-6.jpg",
    description: "Irregular panel layout for chaotic scenes"
  },
];

export default function LayoutCreatorTool() {
  const [selectedTab, setSelectedTab] = useState<string>("presets");
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [pageFormat, setPageFormat] = useState<string>("standard");
  const [panelCount, setPanelCount] = useState<string>("6");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultLayout, setResultLayout] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (selectedTab === "presets" && !selectedLayout) return;
    if (selectedTab === "custom" && !prompt) return;
    
    setIsGenerating(true);
    setResultLayout(null);
    
    try {
      // TODO: Implement actual API call to your layout generation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your API
      if (selectedTab === "presets" && selectedLayout) {
        const selectedPreset = layoutPresets.find(layout => layout.id === selectedLayout);
        setResultLayout(selectedPreset?.image || "/placeholder-layout-1.jpg");
      } else {
        // For custom layouts, just show a default layout as placeholder
        setResultLayout("/placeholder-layout-1.jpg");
      }
    } catch (error) {
      console.error("Failed to generate layout:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Layout Creator</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Layout Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom Layout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select a Layout Template</CardTitle>
                  <CardDescription>
                    Choose from pre-designed manga page layouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {layoutPresets.map((layout) => (
                      <div 
                        key={layout.id}
                        className={`relative rounded-md cursor-pointer border-2 hover:border-primary transition-colors ${
                          selectedLayout === layout.id ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedLayout(layout.id)}
                      >
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={layout.image} 
                            alt={layout.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium text-sm">{layout.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{layout.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Layout Settings</CardTitle>
                  <CardDescription>
                    Configure your custom manga page layout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Page Format</Label>
                    <RadioGroup defaultValue="standard" value={pageFormat} onValueChange={setPageFormat} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="widescreen" id="widescreen" />
                        <Label htmlFor="widescreen">Widescreen</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="webtoon" id="webtoon" />
                        <Label htmlFor="webtoon">Webtoon</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="panel-count">Number of Panels</Label>
                    <Select value={panelCount} onValueChange={setPanelCount}>
                      <SelectTrigger id="panel-count">
                        <SelectValue placeholder="Select number of panels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Panel (Splash Page)</SelectItem>
                        <SelectItem value="2">2 Panels</SelectItem>
                        <SelectItem value="3">3 Panels</SelectItem>
                        <SelectItem value="4">4 Panels</SelectItem>
                        <SelectItem value="6">6 Panels</SelectItem>
                        <SelectItem value="9">9 Panels</SelectItem>
                        <SelectItem value="12">12 Panels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="layout-description">Layout Description</Label>
                    <Textarea
                      id="layout-description"
                      placeholder="Describe your ideal page layout in detail..."
                      className="min-h-[100px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: "A dramatic page with a large panel showing the main character, followed by 3 smaller reaction panels."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={(selectedTab === "presets" && !selectedLayout) || 
                     (selectedTab === "custom" && !prompt) || 
                     isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Layout"
            )}
          </Button>
        </div>
        
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Your generated layout will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-secondary/20 rounded-md">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Generating your layout...</p>
              </div>
            ) : resultLayout ? (
              <img
                src={resultLayout}
                alt="Generated layout"
                className="max-w-full max-h-[600px] object-contain"
              />
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <LayoutGrid className="h-16 w-16 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">Select a layout preset or create a custom one</p>
                <p className="text-sm text-muted-foreground mt-1">Then click generate to create your layout</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 