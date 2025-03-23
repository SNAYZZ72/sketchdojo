"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function CharacterTrainingTool() {
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainedCharacters, setTrainedCharacters] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: string[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === e.target.files?.length) {
              setUploadedImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleStartTraining = async () => {
    if (!characterName || uploadedImages.length < 5) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          // Add new trained character to the list
          setTrainedCharacters(prev => [
            ...prev, 
            { 
              id: Date.now().toString(),
              name: characterName,
              description: characterDescription,
              thumbnail: uploadedImages[0],
              created: new Date().toISOString()
            }
          ]);
          
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Character Training</h1>
      </div>
      
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Train New Character</TabsTrigger>
          <TabsTrigger value="trained">My Trained Characters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Character Information</CardTitle>
              <CardDescription>
                Enter details about the character you want to train
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="character-name">Character Name</Label>
                <Input 
                  id="character-name" 
                  placeholder="Enter character name" 
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="character-description">Character Description</Label>
                <Textarea 
                  id="character-description" 
                  placeholder="Describe your character's appearance and traits"
                  className="min-h-[100px]"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reference Images</CardTitle>
              <CardDescription>
                Upload 5-20 reference images of your character
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img 
                      src={image} 
                      alt={`Reference ${index}`} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                    <button 
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                
                <button 
                  className="border-2 border-dashed border-primary/50 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-6 w-6 text-primary" />
                  <span className="text-sm text-primary mt-2">Add Images</span>
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {uploadedImages.length}/20 images uploaded ({uploadedImages.length < 5 ? `Need at least ${5 - uploadedImages.length} more` : "Ready to train"})
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleStartTraining}
                disabled={isTraining || uploadedImages.length < 5 || !characterName}
                className="w-full"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training... ({trainingProgress}%)
                  </>
                ) : (
                  "Start Training"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {isTraining && (
            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={trainingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Training your character. This may take several minutes.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="trained" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Trained Characters</CardTitle>
              <CardDescription>
                Characters you have trained for your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainedCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You don't have any trained characters yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Train your first character to see it here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainedCharacters.map((character) => (
                    <Card key={character.id}>
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={character.thumbnail} 
                          alt={character.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{character.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {character.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-muted-foreground">
                            {new Date(character.created).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">Use</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 