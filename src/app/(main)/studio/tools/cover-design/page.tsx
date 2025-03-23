"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/global/protected-route';

// Components
import CoverDesignInterface from '@/components/cover-design/CoverDesignInterface';

// Icons
import { Book, Settings, Image as ImageIcon } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download, Loader2, Paintbrush, RefreshCcw, Upload } from "lucide-react";

export default function CoverDesignPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [prompt, setPrompt] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [style, setStyle] = useState<string>("manga");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [showAuthor, setShowAuthor] = useState<boolean>(true);
  const [titleSize, setTitleSize] = useState<number>(36);
  const [authorSize, setAuthorSize] = useState<number>(24);
  const [titleColor, setTitleColor] = useState<string>("#ffffff");
  const [authorColor, setAuthorColor] = useState<string>("#ffffff");
  
  // Styles options
  const coverStyles = [
    { value: "manga", label: "Manga" },
    { value: "comic", label: "Comic" },
    { value: "watercolor", label: "Watercolor" },
    { value: "realistic", label: "Realistic" },
    { value: "minimalist", label: "Minimalist" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "fantasy", label: "Fantasy" }
  ];
  
  // Font options
  const fontOptions = [
    { value: "sans", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
    { value: "display", label: "Display" },
    { value: "handwritten", label: "Handwritten" }
  ];
  const [titleFont, setTitleFont] = useState(fontOptions[0].value);
  const [authorFont, setAuthorFont] = useState(fontOptions[0].value);
  
  // Image positions
  const imagePositions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" }
  ];
  const [titlePosition, setTitlePosition] = useState(imagePositions[0].value);
  const [authorPosition, setAuthorPosition] = useState(imagePositions[0].value);
  
  // Handler for file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image generation
  const handleGenerateCover = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock response - in a real implementation, this would be an API call
      const mockImageUrl = "/placeholder-cover.jpg";
      setCoverImage(mockImageUrl);
    } catch (error) {
      console.error("Error generating cover:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle image customization
  const handleCustomizeImage = async () => {
    if (!uploadedImage && !coverImage) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real implementation, this would send the image and text settings to an API
      // For now, we'll just use the existing image
      
    } catch (error) {
      console.error("Error customizing cover:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Active image to display
  const activeImage = activeTab === "generate" ? coverImage : uploadedImage;
  
  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Cover Designer <Badge variant="outline" className="text-xs ml-2 bg-primary/10 border-primary/20 text-primary">AI</Badge>
              </h1>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary hover:text-primary transition-colors duration-300"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-white/60 mb-8">
              Design professional manga covers with AI assistance. Describe what you want or start with a template.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="generate" className="flex-1">
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cover-title">Cover Title</Label>
                  <Input 
                    id="cover-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter manga/comic title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cover-author">Author Name</Label>
                  <Input 
                    id="cover-author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cover-style">Cover Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="cover-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cover-prompt">Image Description</Label>
                  <Textarea 
                    id="cover-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your cover image in detail..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateCover} 
                  disabled={isGenerating || !prompt} 
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Paintbrush className="h-4 w-4 mr-2" />
                      Generate Cover
                    </>
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0 space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <div className="aspect-[2/3] bg-muted rounded-md overflow-hidden">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded cover" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setUploadedImage(null)}
                        className="w-full"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Upload Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center py-10">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports JPEG, PNG and WebP up to 5MB
                        </p>
                      </div>
                      <Input 
                        id="cover-upload"
                        type="file"
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById("cover-upload")?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}