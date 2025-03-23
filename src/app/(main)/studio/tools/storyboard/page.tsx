"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Layers, Plus, ChevronDown, ChevronUp, ArrowUpDown, Image as ImageIcon, Trash2, PenTool } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Storyboard frame interface
interface StoryboardFrame {
  id: string;
  title: string;
  description: string;
  image: string | null;
  notes: string;
}

// Mock data for initial storyboard
const initialStoryboard: StoryboardFrame[] = [
  {
    id: "frame-1",
    title: "Opening Scene",
    description: "Our hero wakes up in a strange world, surrounded by unknown creatures.",
    image: "/placeholder-storyboard-1.jpg",
    notes: "Use dramatic lighting to emphasize confusion"
  },
  {
    id: "frame-2",
    title: "Meeting the Guide",
    description: "A wise old character appears and offers to help the protagonist.",
    image: "/placeholder-storyboard-2.jpg",
    notes: "Character should have a warm, trustworthy appearance"
  },
  {
    id: "frame-3",
    title: "First Challenge",
    description: "The hero faces their first obstacle in this new world.",
    image: "/placeholder-storyboard-3.jpg",
    notes: "Dynamic action pose, show determination in facial expression"
  }
];

export default function StoryboardTool() {
  const [storyboardFrames, setStoryboardFrames] = useState<StoryboardFrame[]>(initialStoryboard);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>("frame-1");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("visual");
  
  // Frame being edited
  const selectedFrame = selectedFrameId 
    ? storyboardFrames.find(frame => frame.id === selectedFrameId) 
    : null;
  
  const addNewFrame = () => {
    const newFrame: StoryboardFrame = {
      id: `frame-${Date.now()}`,
      title: `New Frame ${storyboardFrames.length + 1}`,
      description: "",
      image: null,
      notes: ""
    };
    
    setStoryboardFrames([...storyboardFrames, newFrame]);
    setSelectedFrameId(newFrame.id);
  };
  
  const updateFrame = (id: string, updates: Partial<StoryboardFrame>) => {
    setStoryboardFrames(storyboardFrames.map(frame => 
      frame.id === id ? { ...frame, ...updates } : frame
    ));
  };
  
  const deleteFrame = (id: string) => {
    const newFrames = storyboardFrames.filter(frame => frame.id !== id);
    setStoryboardFrames(newFrames);
    
    // If we deleted the selected frame, select another one
    if (selectedFrameId === id) {
      setSelectedFrameId(newFrames.length > 0 ? newFrames[0].id : null);
    }
  };
  
  const generateFrameImage = async () => {
    if (!selectedFrame) return;
    
    setIsGeneratingImage(true);
    
    try {
      // TODO: Implement actual API call to your image generation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in real implementation, this would be the URL from your image generation API
      updateFrame(selectedFrame.id, { 
        image: "/placeholder-storyboard-1.jpg" 
      });
    } catch (error) {
      console.error("Failed to generate frame image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(storyboardFrames);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStoryboardFrames(items);
  };
  
  const moveFrameUp = (index: number) => {
    if (index === 0) return;
    
    const newFrames = [...storyboardFrames];
    const temp = newFrames[index];
    newFrames[index] = newFrames[index - 1];
    newFrames[index - 1] = temp;
    setStoryboardFrames(newFrames);
  };
  
  const moveFrameDown = (index: number) => {
    if (index === storyboardFrames.length - 1) return;
    
    const newFrames = [...storyboardFrames];
    const temp = newFrames[index];
    newFrames[index] = newFrames[index + 1];
    newFrames[index + 1] = temp;
    setStoryboardFrames(newFrames);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Storyboard Creator</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Frames</CardTitle>
              <Button size="sm" onClick={addNewFrame}>
                <Plus className="h-4 w-4 mr-1" />
                Add Frame
              </Button>
            </div>
            <CardDescription>
              Organize your story sequence
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="frames">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {storyboardFrames.map((frame, index) => (
                      <Draggable key={frame.id} draggableId={frame.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center p-2 rounded-md border ${
                              selectedFrameId === frame.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            } cursor-pointer group`}
                            onClick={() => setSelectedFrameId(frame.id)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{frame.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {frame.description || "No description"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFrameUp(index);
                                }}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFrameDown(index);
                                }}
                                disabled={index === storyboardFrames.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFrame(frame.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
          <CardFooter className="border-t bg-card">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <span>{storyboardFrames.length} frames total</span>
              <div className="flex items-center">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                <span>Drag to reorder</span>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col">
          {selectedFrame ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Input 
                    value={selectedFrame.title}
                    onChange={(e) => updateFrame(selectedFrame.id, { title: e.target.value })}
                    className="text-xl font-bold h-auto text-lg border-0 px-0 focus-visible:ring-0"
                    placeholder="Frame Title"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visual" className="space-y-4 mt-4">
                    <div className="aspect-video bg-secondary/20 rounded-md overflow-hidden flex items-center justify-center">
                      {isGeneratingImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <p className="text-sm text-muted-foreground">Generating image...</p>
                        </div>
                      ) : selectedFrame.image ? (
                        <img 
                          src={selectedFrame.image} 
                          alt={selectedFrame.title} 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-16 w-16 text-muted-foreground opacity-20" />
                          <p className="text-sm text-muted-foreground">No image generated yet</p>
                          <Button onClick={generateFrameImage}>Generate Image</Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frame Description</label>
                      <Textarea
                        value={selectedFrame.description}
                        onChange={(e) => updateFrame(selectedFrame.id, { description: e.target.value })}
                        placeholder="Describe what happens in this frame..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Visual Notes</label>
                      <Textarea
                        value={selectedFrame.notes}
                        onChange={(e) => updateFrame(selectedFrame.id, { notes: e.target.value })}
                        placeholder="Add notes about visual style, camera angle, etc..."
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/50">
                      <h3 className="font-medium mb-2 flex items-center">
                        <PenTool className="h-4 w-4 mr-2" />
                        Image Generation Tools
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          onClick={generateFrameImage}
                          disabled={isGeneratingImage}
                          className="w-full"
                        >
                          {isGeneratingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Generate Frame Image
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Generates an image based on the frame description and notes
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Layers className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Frame Selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a frame from the list or create a new one to start building your storyboard
              </p>
              <Button onClick={addNewFrame}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Frame
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 