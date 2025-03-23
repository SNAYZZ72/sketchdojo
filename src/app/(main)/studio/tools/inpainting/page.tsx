"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";

export default function InpaintingTool() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);

  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaskUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMaskImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInpainting = async () => {
    if (!sourceImage || !maskImage) return;
    
    setIsProcessing(true);
    setResultImage(null);
    
    try {
      // TODO: Implement actual API call to your inpainting service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your inpainting API
      setResultImage(sourceImage); // Just showing the source image as placeholder
    } catch (error) {
      console.error("Failed to process inpainting:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inpainting Tool</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Source Image</CardTitle>
            <CardDescription>
              Upload the original image you want to modify
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={sourceInputRef}
              onChange={handleSourceUpload}
            />
            <div 
              className="border-2 border-dashed border-primary/50 rounded-md min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => sourceInputRef.current?.click()}
            >
              {sourceImage ? (
                <img 
                  src={sourceImage} 
                  alt="Source" 
                  className="max-w-full max-h-[300px] object-contain" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload source image</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mask</CardTitle>
            <CardDescription>
              Upload the mask or area to inpaint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={maskInputRef}
              onChange={handleMaskUpload}
            />
            <div 
              className="border-2 border-dashed border-primary/50 rounded-md min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => maskInputRef.current?.click()}
            >
              {maskImage ? (
                <img 
                  src={maskImage} 
                  alt="Mask" 
                  className="max-w-full max-h-[300px] object-contain" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload mask image</p>
                </div>
              )}
            </div>
            <Textarea
              placeholder="Enter a prompt for what to generate in the masked area..."
              className="min-h-[80px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleInpainting}
              disabled={!sourceImage || !maskImage || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Inpainting"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Your inpainted image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-secondary/20 rounded-md">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Processing your image...</p>
              </div>
            ) : resultImage ? (
              <img
                src={resultImage}
                alt="Inpainted result"
                className="max-w-full max-h-[500px] object-contain"
              />
            ) : (
              <p className="text-muted-foreground">Upload images and click process</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 