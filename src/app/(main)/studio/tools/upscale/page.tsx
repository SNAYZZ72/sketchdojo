"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Download, Zap, Image as ImageIcon } from "lucide-react";

export default function UpscaleTool() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [scale, setScale] = useState<string>("2x");
  const [enhanceQuality, setEnhanceQuality] = useState<boolean>(true);
  const [denoise, setDenoise] = useState<number>(0);
  const [sharpness, setSharpness] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{width: number, height: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceImage(event.target.result as string);
          
          // Get dimensions of the uploaded image
          const img = new Image();
          img.onload = () => {
            setOriginalDimensions({
              width: img.width,
              height: img.height
            });
            
            // Calculate result dimensions based on selected scale
            const scaleFactor = parseInt(scale.replace('x', ''));
            setResultDimensions({
              width: img.width * scaleFactor,
              height: img.height * scaleFactor
            });
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (value: string) => {
    setScale(value);
    
    // Update result dimensions based on new scale
    if (originalDimensions) {
      const scaleFactor = parseInt(value.replace('x', ''));
      setResultDimensions({
        width: originalDimensions.width * scaleFactor,
        height: originalDimensions.height * scaleFactor
      });
    }
  };

  const handleUpscale = async () => {
    if (!sourceImage) return;
    
    setIsProcessing(true);
    setResultImage(null);
    
    try {
      // TODO: Implement actual API call to your upscaling service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your upscaling API
      setResultImage(sourceImage); // Just showing the source image as placeholder
    } catch (error) {
      console.error("Failed to upscale image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Image Upscaler</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Source Image</CardTitle>
            <CardDescription>
              Upload the image you want to upscale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <div 
              className="border-2 border-dashed border-primary/50 rounded-md min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {sourceImage ? (
                <div className="w-full relative">
                  <img 
                    src={sourceImage} 
                    alt="Source" 
                    className="max-w-full max-h-[300px] mx-auto object-contain" 
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height}` : 'Original'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF, max 10MB</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upscale Settings</CardTitle>
            <CardDescription>
              Configure your upscaling parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scale-select">Scale Factor</Label>
              <Select value={scale} onValueChange={handleScaleChange}>
                <SelectTrigger id="scale-select">
                  <SelectValue placeholder="Select scale factor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2x">2x Upscale</SelectItem>
                  <SelectItem value="4x">4x Upscale</SelectItem>
                  <SelectItem value="6x">6x Upscale</SelectItem>
                  <SelectItem value="8x">8x Upscale</SelectItem>
                </SelectContent>
              </Select>
              {resultDimensions && (
                <p className="text-xs text-muted-foreground">
                  Output size: {resultDimensions.width} × {resultDimensions.height} px
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enhance-quality">Enhance Quality</Label>
                <p className="text-xs text-muted-foreground">
                  AI-powered quality enhancement
                </p>
              </div>
              <Switch 
                id="enhance-quality" 
                checked={enhanceQuality} 
                onCheckedChange={setEnhanceQuality}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="denoise-slider">Denoise Strength</Label>
                <span className="text-sm text-muted-foreground">{denoise}%</span>
              </div>
              <Slider
                id="denoise-slider"
                defaultValue={[0]}
                value={[denoise]}
                max={100}
                step={5}
                onValueChange={(value) => setDenoise(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="sharpness-slider">Sharpness</Label>
                <span className="text-sm text-muted-foreground">{sharpness}%</span>
              </div>
              <Slider
                id="sharpness-slider"
                defaultValue={[0]}
                value={[sharpness]}
                max={100}
                step={5}
                onValueChange={(value) => setSharpness(value[0])}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpscale}
              disabled={!sourceImage || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Upscale Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Your upscaled image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-secondary/20 rounded-md min-h-[300px]">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Upscaling your image...</p>
              </div>
            ) : resultImage ? (
              <div className="w-full relative">
                <img
                  src={resultImage}
                  alt="Upscaled result"
                  className="max-w-full max-h-[300px] mx-auto object-contain"
                />
                {resultDimensions && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="text-xs">
                      {resultDimensions.width} × {resultDimensions.height}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">Upload an image and adjust settings</p>
                <p className="text-sm text-muted-foreground mt-1">Then click upscale</p>
              </div>
            )}
          </CardContent>
          {resultImage && (
            <CardFooter className="pt-2">
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Upscaled Image
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
} 