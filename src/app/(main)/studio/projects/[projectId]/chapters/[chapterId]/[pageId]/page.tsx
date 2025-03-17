// src/app/(main)/studio/projects/[projectId]/chapters/[chapterId]/[pageId]/page.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useDebouncedCallback } from 'use-debounce';

// Import UI components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import icons
import {
  Loader2,
  FileX,
  ArrowLeft,
  Eye,
  Save,
  Plus,
  MessageCircle,
  Trash2,
  User,
  ArrowDown,
  ArrowUp,
  LayoutPanelLeft,
  Image as ImageIcon
} from 'lucide-react';

// Define types for the page structure
interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface Size {
  width: number;
  height: number;
}

interface PanelCharacter {
  id: string;
  character_id: string;
  position: Position;
  scale: number;
  rotation: number;
  flip_x: boolean;
  flip_y: boolean;
  pose: string;
  expression: string;
  z_index: number;
}

interface DialogBubble {
  id: string;
  text: string;
  position: Position;
  size: Size;
  bubble_type: string;
  character_id: string | null;
  style: {
    font_family: string;
    font_size: number;
    font_weight: string;
    text_align: string;
  };
}

interface Panel {
  id: string;
  position: Position;
  background_id: string | null;
  characters: PanelCharacter[];
  dialog_bubbles: DialogBubble[];
  effects: any[];
  z_index: number;
}

interface PageContent {
  panels: Panel[];
  background_color?: string;
  page_notes?: string;
}

interface Page {
  id: string;
  chapter_id: string;
  title?: string;
  order_index: number;
  layout_type: string;
  content: PageContent;
  created_at: string;
  updated_at: string;
}

interface Character {
  id: string;
  name: string;
  image_url: string | null;
  description?: string;
  metadata?: any;
}

interface Background {
  id: string;
  name: string;
  image_url: string | null;
  description?: string;
  metadata?: any;
}

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [characterLibrary, setCharacterLibrary] = useState<Character[]>([]);
  const [backgroundLibrary, setBackgroundLibrary] = useState<Background[]>([]);
  const [activeTab, setActiveTab] = useState('panels');
  
  // Fetch page data on mount
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch page
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('id', params.pageId)
          .single();
        
        if (pageError) {
          throw pageError;
        }
        
        setPage(pageData as Page);
        
        // Fetch character library
        const { data: characters, error: charactersError } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', 'current_user_id'); // Replace with actual user ID
        
        if (charactersError) {
          console.error("Error fetching characters:", charactersError);
        } else {
          setCharacterLibrary(characters as Character[] || []);
        }
        
        // Fetch background library
        const { data: backgrounds, error: backgroundsError } = await supabase
          .from('backgrounds')
          .select('*')
          .eq('user_id', 'current_user_id'); // Replace with actual user ID
        
        if (backgroundsError) {
          console.error("Error fetching backgrounds:", backgroundsError);
        } else {
          setBackgroundLibrary(backgrounds as Background[] || []);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
        toast.error("Failed to load page");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageData();
  }, [params.pageId, supabase]);
  
  // Save page changes
  const savePage = useDebouncedCallback(async () => {
    if (!page) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('pages')
        .update({ content: page.content })
        .eq('id', page.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  }, 1000);
  
  // Add a new panel
  const addPanel = () => {
    if (!page) return;
    
    const newPanel: Panel = {
      id: `panel_${Date.now()}`,
      position: { x: 20, y: 20, width: 200, height: 200 },
      background_id: null,
      characters: [],
      dialog_bubbles: [],
      effects: [],
      z_index: page.content.panels.length
    };
    
    setPage({
      ...page,
      content: {
        ...page.content,
        panels: [...page.content.panels, newPanel]
      }
    });
    setSelectedPanelId(newPanel.id);
    savePage();
  };
  
  // Delete a panel
  const deletePanel = (panelId: string) => {
    if (!page) return;
    
    const updatedPanels = page.content.panels.filter(panel => panel.id !== panelId);
    
    setPage({
      ...page,
      content: {
        ...page.content,
        panels: updatedPanels
      }
    });
    setSelectedPanelId(null);
    savePage();
  };
  
  // Add a character to a panel
  const addCharacterToPanel = (characterId: string, panelId: string) => {
    if (!page) return;
    
    const character = characterLibrary.find(char => char.id === characterId);
    if (!character) return;
    
    const panelIndex = page.content.panels.findIndex(panel => panel.id === panelId);
    if (panelIndex === -1) return;
    
    const newPanelCharacter: PanelCharacter = {
      id: `character_${Date.now()}`,
      character_id: characterId,
      position: { x: 50, y: 50 },
      scale: 1,
      rotation: 0,
      flip_x: false,
      flip_y: false,
      pose: 'standing',
      expression: 'neutral',
      z_index: page.content.panels[panelIndex].characters.length
    };
    
    const updatedPanels = [...page.content.panels];
    updatedPanels[panelIndex] = {
      ...updatedPanels[panelIndex],
      characters: [...updatedPanels[panelIndex].characters, newPanelCharacter]
    };
    
    setPage({
      ...page,
      content: {
        ...page.content,
        panels: updatedPanels
      }
    });
    savePage();
  };
  
  // Add a dialog bubble
  const addDialogBubble = (panelId: string) => {
    if (!page) return;
    
    const panelIndex = page.content.panels.findIndex(panel => panel.id === panelId);
    if (panelIndex === -1) return;
    
    const newDialogBubble: DialogBubble = {
      id: `dialog_${Date.now()}`,
      text: 'Enter text here...',
      position: { x: 50, y: 50 },
      size: { width: 150, height: 80 },
      bubble_type: 'speech',
      character_id: null,
      style: {
        font_family: 'Arial',
        font_size: 14,
        font_weight: 'normal',
        text_align: 'center'
      }
    };
    
    const updatedPanels = [...page.content.panels];
    updatedPanels[panelIndex] = {
      ...updatedPanels[panelIndex],
      dialog_bubbles: [...updatedPanels[panelIndex].dialog_bubbles, newDialogBubble]
    };
    
    setPage({
      ...page,
      content: {
        ...page.content,
        panels: updatedPanels
      }
    });
    savePage();
  };
  
  // Set background for a panel
  const setPanelBackground = (backgroundId: string, panelId: string) => {
    if (!page) return;
    
    const panelIndex = page.content.panels.findIndex(panel => panel.id === panelId);
    if (panelIndex === -1) return;
    
    const updatedPanels = [...page.content.panels];
    updatedPanels[panelIndex] = {
      ...updatedPanels[panelIndex],
      background_id: backgroundId
    };
    
    setPage({
      ...page,
      content: {
        ...page.content,
        panels: updatedPanels
      }
    });
    savePage();
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Page not found
  if (!page) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
        <FileX className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been deleted.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => router.push(`/studio/projects/${params.projectId}/chapters/${params.chapterId}`)}
        >
          Return to Chapter
        </Button>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/studio/projects/${params.projectId}/chapters/${params.chapterId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-sm">
            Page {page.order_index + 1}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {}}
            className="gap-1"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => savePage()}
            className="gap-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="panels">Panels</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
              </TabsList>
              
              <TabsContent value="panels" className="mt-4">
                <div className="space-y-4">
                  <Button 
                    onClick={addPanel} 
                    className="w-full gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Panel
                  </Button>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Panel Templates</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Panel templates */}
                      <Card 
                        className="cursor-pointer hover:border-primary transition-colors p-2"
                        onClick={() => {}}
                      >
                        <div className="aspect-square border rounded"></div>
                      </Card>
                      <Card 
                        className="cursor-pointer hover:border-primary transition-colors p-2"
                        onClick={() => {}}
                      >
                        <div className="aspect-square border rounded grid grid-cols-2 gap-1">
                          <div className="border"></div>
                          <div className="border"></div>
                          <div className="border"></div>
                          <div className="border"></div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  
                  {selectedPanelId && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Panel Controls</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-1"
                          onClick={() => addDialogBubble(selectedPanelId)}
                        >
                          <MessageCircle className="h-4 w-4" /> Add Dialog
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-1 text-destructive"
                          onClick={() => deletePanel(selectedPanelId)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Panel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="characters" className="mt-4">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Search characters..." 
                    className="w-full p-2 text-sm border rounded-md"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    {characterLibrary.map(character => (
                      <div 
                        key={character.id} 
                        className="cursor-pointer border rounded-md overflow-hidden hover:border-primary transition-colors"
                        onClick={() => selectedPanelId && addCharacterToPanel(character.id, selectedPanelId)}
                      >
                        <div className="aspect-square bg-muted">
                          {character.image_url ? (
                            <img 
                              src={character.image_url} 
                              alt={character.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-1 text-xs truncate text-center">
                          {character.name}
                        </div>
                      </div>
                    ))}
                    
                    {/* Create new character button */}
                    <div 
                      className="cursor-pointer border border-dashed rounded-md overflow-hidden hover:border-primary transition-colors"
                      onClick={() => router.push('/studio/characters')}
                    >
                      <div className="aspect-square flex items-center justify-center">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="p-1 text-xs text-center">
                        New Character
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="backgrounds" className="mt-4">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Search backgrounds..." 
                    className="w-full p-2 text-sm border rounded-md"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundLibrary.map(background => (
                      <div 
                        key={background.id} 
                        className="cursor-pointer border rounded-md overflow-hidden hover:border-primary transition-colors"
                        onClick={() => selectedPanelId && setPanelBackground(background.id, selectedPanelId)}
                      >
                        <div className="aspect-[4/3] bg-muted">
                          {background.image_url ? (
                            <img 
                              src={background.image_url} 
                              alt={background.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-1 text-xs truncate text-center">
                          {background.name}
                        </div>
                      </div>
                    ))}
                    
                    {/* Create new background button */}
                    <div 
                      className="cursor-pointer border border-dashed rounded-md overflow-hidden hover:border-primary transition-colors"
                      onClick={() => router.push('/studio/backgrounds')}
                    >
                      <div className="aspect-[4/3] flex items-center justify-center">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="p-1 text-xs text-center">
                        New Background
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div 
            ref={canvasRef}
            className="w-[840px] h-[1188px] bg-white shadow-lg relative"
            style={{ transformOrigin: 'center', transform: 'scale(0.7)' }}
          >
            {/* Render panels */}
            {page.content.panels.map(panel => (
              <div 
                key={panel.id}
                className={`absolute border-2 ${selectedPanelId === panel.id ? 'border-primary' : 'border-gray-300'}`}
                style={{
                  left: `${panel.position.x}px`,
                  top: `${panel.position.y}px`,
                  width: `${panel.position.width}px`,
                  height: `${panel.position.height}px`,
                  zIndex: panel.z_index
                }}
                onClick={() => setSelectedPanelId(panel.id)}
              >
                {/* Panel background */}
                {panel.background_id && backgroundLibrary.find(bg => bg.id === panel.background_id)?.image_url && (
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={backgroundLibrary.find(bg => bg.id === panel.background_id)?.image_url || ''} 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Panel characters */}
                {panel.characters.map(character => {
                  const characterData = characterLibrary.find(char => char.id === character.character_id);
                  return (
                    <div 
                      key={character.id}
                      className="absolute"
                      style={{
                        left: `${character.position.x}px`,
                        top: `${character.position.y}px`,
                        transform: `scale(${character.scale}) rotate(${character.rotation}deg) scaleX(${character.flip_x ? -1 : 1}) scaleY(${character.flip_y ? -1 : 1})`,
                        zIndex: character.z_index
                      }}
                    >
                      {characterData?.image_url ? (
                        <img 
                          src={characterData.image_url} 
                          alt={characterData.name} 
                          className="max-w-full"
                        />
                      ) : (
                        <div className="w-24 h-48 bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Panel dialog bubbles */}
                {panel.dialog_bubbles.map(bubble => (
                  <div 
                    key={bubble.id}
                    className="absolute bg-white border rounded-lg p-2"
                    style={{
                      left: `${bubble.position.x}px`,
                      top: `${bubble.position.y}px`,
                      width: `${bubble.size.width}px`,
                      minHeight: `${bubble.size.height}px`,
                    }}
                  >
                    <div 
                      contentEditable 
                      suppressContentEditableWarning 
                      className="w-full h-full outline-none text-center"
                      style={{
                        fontFamily: bubble.style.font_family,
                        fontSize: `${bubble.style.font_size}px`,
                        fontWeight: bubble.style.font_weight,
                        textAlign: bubble.style.text_align as any,
                      }}
                    >
                      {bubble.text}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Sidebar - Properties */}
        <div className="w-64 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Properties</h3>
            
            {selectedPanelId ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Panel Properties</h4>
                
                {/* Panel position and size controls */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">X Position</Label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs"
                      value={page.content.panels.find(p => p.id === selectedPanelId)?.position.x || 0}
                      onChange={(e) => {
                        const updatedPanels = page.content.panels.map(panel => {
                          if (panel.id === selectedPanelId) {
                            return {
                              ...panel,
                              position: {
                                ...panel.position,
                                x: parseInt(e.target.value) || 0
                              }
                            };
                          }
                          return panel;
                        });
                        
                        setPage({
                          ...page,
                          content: {
                            ...page.content,
                            panels: updatedPanels
                          }
                        });
                        savePage();
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y Position</Label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs"
                      value={page.content.panels.find(p => p.id === selectedPanelId)?.position.y || 0}
                      onChange={(e) => {
                        const updatedPanels = page.content.panels.map(panel => {
                          if (panel.id === selectedPanelId) {
                            return {
                              ...panel,
                              position: {
                                ...panel.position,
                                y: parseInt(e.target.value) || 0
                              }
                            };
                          }
                          return panel;
                        });
                        
                        setPage({
                          ...page,
                          content: {
                            ...page.content,
                            panels: updatedPanels
                          }
                        });
                        savePage();
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Width</Label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs"
                      value={page.content.panels.find(p => p.id === selectedPanelId)?.position.width || 0}
                      onChange={(e) => {
                        const updatedPanels = page.content.panels.map(panel => {
                          if (panel.id === selectedPanelId) {
                            return {
                              ...panel,
                              position: {
                                ...panel.position,
                                width: parseInt(e.target.value) || 0
                              }
                            };
                          }
                          return panel;
                        });
                        
                        setPage({
                          ...page,
                          content: {
                            ...page.content,
                            panels: updatedPanels
                          }
                        });
                        savePage();
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height</Label>
                    <Input 
                      type="number" 
                      className="h-8 text-xs"
                      value={page.content.panels.find(p => p.id === selectedPanelId)?.position.height || 0}
                      onChange={(e) => {
                        const updatedPanels = page.content.panels.map(panel => {
                          if (panel.id === selectedPanelId) {
                            return {
                              ...panel,
                              position: {
                                ...panel.position,
                                height: parseInt(e.target.value) || 0
                              }
                            };
                          }
                          return panel;
                        });
                        
                        setPage({
                          ...page,
                          content: {
                            ...page.content,
                            panels: updatedPanels
                          }
                        });
                        savePage();
                      }}
                    />
                  </div>
                </div>
                
                {/* Z-index control */}
                <div>
                  <Label className="text-xs">Layer (Z-Index)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        const panel = page.content.panels.find(p => p.id === selectedPanelId);
                        if (!panel || panel.z_index <= 0) return;
                        
                        const updatedPanels = page.content.panels.map(p => {
                          if (p.id === selectedPanelId) {
                            return {
                              ...p,
                              z_index: p.z_index - 1
                            };
                          } else if (p.z_index === panel.z_index - 1) {
                            return {
                              ...p,
                              z_index: p.z_index + 1
                            };
                          }
                          return p;
                        });
                        
                        setPage({
                          ...page,
                          content: {
                            ...page.content,
                            panels: updatedPanels
                          }
                        });
                        savePage();
                      }}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center text-sm">
                      {page.content.panels.find(p => p.id === selectedPanelId)?.z_index}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        const panel = page.content.panels.find(p => p.id === selectedPanelId);
                        if (!panel || panel.z_index >= page.content.panels.length - 1) return;
                        
                        const updatedPanels = page.content.panels.map(p => {
                            if (p.id === selectedPanelId) {
                              return {
                                ...p,
                                z_index: p.z_index + 1
                              };
                            } else if (p.z_index === panel.z_index + 1) {
                              return {
                                ...p,
                                z_index: p.z_index - 1
                              };
                            }
                            return p;
                          });
                          
                          setPage({
                            ...page,
                            content: {
                              ...page.content,
                              panels: updatedPanels
                            }
                          });
                          savePage();
                        }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <LayoutPanelLeft className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a panel to edit its properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
   }