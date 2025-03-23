"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Pose presets data
const posePresets = [
  { id: 1, name: "Standing", image: "/placeholder-pose-1.jpg" },
  { id: 2, name: "Action", image: "/placeholder-pose-2.jpg" },
  { id: 3, name: "Sitting", image: "/placeholder-pose-3.jpg" },
  { id: 4, name: "Running", image: "/placeholder-pose-4.jpg" },
  { id: 5, name: "Fighting", image: "/placeholder-pose-5.jpg" },
  { id: 6, name: "Dramatic", image: "/placeholder-pose-6.jpg" },
];

export default function PoseCreatorTool() {
  const [selectedPose, setSelectedPose] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [strength, setStrength] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedPose && !prompt) return;
    
    setIsGenerating(true);
    setResultImage(null);
    
    try {
      // TODO: Implement actual API call to your pose generation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your API
      const selectedPreset = posePresets.find(pose => pose.id === selectedPose);
      setResultImage(selectedPreset?.image || "/placeholder-pose-1.jpg");
    } catch (error) {
      console.error("Failed to generate pose:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pose Creator</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pose Presets</CardTitle>
              <CardDescription>
                Select a starting pose or create one from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {posePresets.map((pose) => (
                  <div 
                    key={pose.id}
                    className={`aspect-square relative overflow-hidden rounded-md cursor-pointer border-2 hover:border-primary transition-colors ${
                      selectedPose === pose.id ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedPose(pose.id)}
                  >
                    <img 
                      src={pose.image} 
                      alt={pose.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <p className="text-white text-sm text-center">{pose.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pose Customization</CardTitle>
              <CardDescription>
                Customize your pose with text prompts and controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pose-prompt">Pose Description</Label>
                <Textarea
                  id="pose-prompt"
                  placeholder="Describe the pose you want to create or modify..."
                  className="min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="strength-slider">Modification Strength</Label>
                  <span className="text-sm text-muted-foreground">{strength}%</span>
                </div>
                <Slider
                  id="strength-slider"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setStrength(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values retain more of the original pose, higher values apply more of your customizations.
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={(!selectedPose && !prompt) || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Pose"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Your generated pose will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-secondary/20 rounded-md">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Generating your pose...</p>
              </div>
            ) : resultImage ? (
              <img
                src={resultImage}
                alt="Generated pose"
                className="max-w-full max-h-[600px] object-contain"
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground">Select a pose preset or enter a description</p>
                <p className="text-sm text-muted-foreground mt-1">Then click generate to create your pose</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 