"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Download, RotateCcw, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ImageGeneratorTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = searchParams.get("project");
  
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle project context
  const [projectName, setProjectName] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectId) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          setProjectName("My Manga Project"); // This would come from the API in a real implementation
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };
    
    fetchProjectDetails();
  }, [projectId]);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      // TODO: Implement actual API call to your image generation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your image generation API
      setGeneratedImage("/placeholder-image.jpg");
      
      toast({
        title: "Image generated",
        description: "Your image has been successfully generated",
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveToProject = async () => {
    if (!generatedImage || !projectId) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Saved to project",
        description: "Image has been saved to your project",
      });
    } catch (error) {
      console.error("Failed to save to project:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving to your project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {projectId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push(`/studio/projects/${projectId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Project
              </Button>
            )}
            <h1 className="text-3xl font-bold">Image Generator</h1>
            {projectName && (
              <Badge variant="secondary" className="ml-2">
                Project: {projectName}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Generate high-quality manga panels and illustrations
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Image</CardTitle>
            <CardDescription>
              Describe what you want to generate in detail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                placeholder="A detailed description of the manga panel or illustration you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Negative Prompt (Optional)</p>
              <Textarea
                placeholder="Elements you want to exclude from the generation..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt} 
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Your generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden w-full aspect-square bg-muted flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Generating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated illustration" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your generated image will appear here
                </p>
              )}
            </div>
          </CardContent>
          {generatedImage && (
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button 
                className="flex-1" 
                disabled={isSaving || !projectId}
                onClick={handleSaveToProject}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {projectId ? 'Save to Project' : 'No Project Selected'}
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={() => setGeneratedImage(null)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
} 