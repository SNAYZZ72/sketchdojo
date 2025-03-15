"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import ProtectedRoute from '@/components/protected-route';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Constants
import {
  sceneGeneratorTabs,
  panelLayoutOptions,
  sceneStyles,
  sceneTypeOptions,
  cameraAngleOptions,
  perspectiveOptions,
  timeOfDayOptions,
  lightingOptions,
  weatherOptions,
  environmentOptions,
  moodOptions,
  actionOptions,
  characterPositionOptions,
  effectOptions,
  dialogBubbleOptions,
  compositionOptions,
  sceneQualityPresets,
  sceneGuidanceSettings,
  defaultSceneGenerationParams,
  sceneAspectRatios,
  sceneExportFormats,
  Scene,
  SceneMetadata,
  SceneCharacter,
  SceneDialog
} from '@/components/constants/scenes';

// Import from character constants for character selection
import {
  Character,
} from '@/components/constants/characters';

// Icons
import {
  Download,
  Save,
  Share,
  RefreshCw,
  Wand2,
  Copy,
  PlusCircle,
  MinusCircle,
  Image as ImageIcon,
  Sparkles,
  Undo,
  Redo,
  Shuffle,
  SlidersHorizontal,
  RotateCw,
  Dice3,
  BookOpen,
  PlusSquare,
  BookmarkPlus,
  ClipboardCheck,
  Eye,
  EyeOff,
  HelpCircle,
  History,
  Undo2,
  ChevronRight,
  ChevronDown,
  Loader2,
  LayoutGrid,
  Users,
  Type,
  Settings,
  Palette,
  Trash2,
  Maximize,
  Minimize,
  MoveHorizontal,
  MoveVertical,
  MessageCircle,
  Plus,
  X,
  Edit,
  PanelLeftClose,
  PanelRightClose,
  ArrowUpRight,
  LucideProps
} from 'lucide-react';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function SceneGeneratorPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Scene state
  const [scene, setScene] = useState<Partial<SceneMetadata>>({
    panel_layout: 'single',
    style: 'manga',
    scene_type: 'action',
    camera_angle: 'eye_level',
    perspective: 'normal',
    time_of_day: 'midday',
    lighting: 'natural',
    weather: 'clear',
    environment: 'urban',
    mood: 'dramatic',
    action: 'fighting',
    characters: [],
    effects: [],
    dialog: [],
    composition: 'rule_of_thirds',
  });
  
  // Form state
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    projectId: null as string | null,
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState('layout');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [generationParams, setGenerationParams] = useState(defaultSceneGenerationParams);
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [selectedGuidance, setSelectedGuidance] = useState(7);
  const [aspectRatio, setAspectRatio] = useState(sceneAspectRatios[0].value);
  const [randomSeed, setRandomSeed] = useState(true);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [savingScene, setSavingScene] = useState(false);
  const [panelEditorOpen, setPanelEditorOpen] = useState(false);
  const [dialogEditorOpen, setDialogEditorOpen] = useState(false);
  const [characterMenuOpen, setCharacterMenuOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  
  // Temporary character dialog state
  const [currentDialogText, setCurrentDialogText] = useState('');
  const [currentDialogCharacter, setCurrentDialogCharacter] = useState<string | null>(null);
  const [currentDialogType, setCurrentDialogType] = useState('normal');
  const [currentDialogPosition, setCurrentDialogPosition] = useState('center');
  
  // Refs
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const negativePromptRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Mock data for character selection
  const mockCharacters: Partial<Character>[] = [
    { id: 'char-1', name: 'Hero Protagonist', metadata: { gender: 'male', age: 'young_adult', style: 'anime' } },
    { id: 'char-2', name: 'Sidekick Friend', metadata: { gender: 'female', age: 'teenager', style: 'anime' } },
    { id: 'char-3', name: 'Mysterious Mentor', metadata: { gender: 'male', age: 'older_adult', style: 'anime' } },
    { id: 'char-4', name: 'Rival Character', metadata: { gender: 'male', age: 'young_adult', style: 'anime' } },
    { id: 'char-5', name: 'Villain Boss', metadata: { gender: 'female', age: 'adult', style: 'anime' } },
  ];
  
  // Sample projects for dropdown (this would be fetched from your database)
  const sampleProjects = [
    { id: 'project-1', title: 'Midnight Samurai' },
    { id: 'project-2', title: 'Cyber Academy' },
    { id: 'project-3', title: 'Dragon\'s Journey' },
  ];
  
  // Layout grid configuration based on panel type
  const getPanelLayout = (layoutType: string) => {
    switch (layoutType) {
      case 'single':
        return { rows: 1, cols: 1, areas: "'a'" };
      case 'horizontal_2':
        return { rows: 1, cols: 2, areas: "'a b'" };
      case 'vertical_2':
        return { rows: 2, cols: 1, areas: "'a'\n'b'" };
      case 'grid_4':
        return { rows: 2, cols: 2, areas: "'a b'\n'c d'" };
      case 'grid_6':
        return { rows: 3, cols: 2, areas: "'a b'\n'c d'\n'e f'" };
      case 'grid_9':
        return { rows: 3, cols: 3, areas: "'a b c'\n'd e f'\n'g h i'" };
      case 'asymmetric_3':
        return { rows: 2, cols: 2, areas: "'a a'\n'b c'" };
      case 'asymmetric_5':
        return { rows: 3, cols: 2, areas: "'a b'\n'c c'\n'd e'" };
      case 'manga_dynamic':
        return { rows: 3, cols: 3, areas: "'a a b'\n'c d d'\n'c e e'" };
      case 'custom':
      default:
        return { rows: 1, cols: 1, areas: "'a'" };
    }
  };
  
  // Get the number of panels in the current layout
  const getNumberOfPanels = (layoutType: string) => {
    switch (layoutType) {
      case 'single': return 1;
      case 'horizontal_2': case 'vertical_2': return 2;
      case 'asymmetric_3': return 3;
      case 'grid_4': return 4;
      case 'asymmetric_5': return 5;
      case 'grid_6': return 6;
      case 'grid_9': return 9;
      case 'manga_dynamic': return 5;
      case 'custom': return 1;
      default: return 1;
    }
  };
  
  // Generate random panel layout
  const generateRandomLayout = () => {
    const randomLayoutIndex = Math.floor(Math.random() * (panelLayoutOptions.length - 1)); // Exclude custom
    return panelLayoutOptions[randomLayoutIndex].value;
  };
  
  // Generate scene
  const generateScene = async () => {
    try {
      setIsGenerating(true);
      
      // Build the prompt from scene attributes
      const prompt = buildPrompt();
      
      // In a real implementation, this would call your AI service
      // For this demo, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample image URL (in a real app, this would come from your AI service)
      const generatedImageUrl = "/sample-scene.png"; // This would be the URL returned by your API
      
      // Add to generation history
      setGenerationHistory(prev => [...prev, generatedImageUrl]);
      setCurrentImageIndex(generationHistory.length);
      
      // Store the prompt and parameters used
      setScene(prev => ({
        ...prev,
        prompt_used: prompt,
        negative_prompt: generationParams.negative_prompt,
        generation_params: {
          ...generationParams,
          seed: randomSeed ? Math.floor(Math.random() * 1000000) : currentSeed
        }
      }));
      
      toast.success("Scene generated successfully!");
      
    } catch (error) {
      console.error("Error generating scene:", error);
      toast.error("Failed to generate scene. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Build prompt from scene attributes
  const buildPrompt = () => {
    const {
      panel_layout,
      style,
      scene_type,
      camera_angle,
      perspective,
      time_of_day,
      lighting,
      weather,
      environment,
      mood,
      action,
      characters,
      effects,
      composition,
    } = scene;
    
    // Get the label values instead of the value codes
    const styleLabel = sceneStyles.find(option => option.value === style)?.label || style;
    const sceneTypeLabel = sceneTypeOptions.find(option => option.value === scene_type)?.label || scene_type;
    const cameraLabel = cameraAngleOptions.find(option => option.value === camera_angle)?.label || camera_angle;
    const perspectiveLabel = perspectiveOptions.find(option => option.value === perspective)?.label || perspective;
    const timeOfDayLabel = timeOfDayOptions.find(option => option.value === time_of_day)?.label || time_of_day;
    const lightingLabel = lightingOptions.find(option => option.value === lighting)?.label || lighting;
    const weatherLabel = weatherOptions.find(option => option.value === weather)?.label || weather;
    const environmentLabel = environmentOptions.find(option => option.value === environment)?.label || environment;
    const moodLabel = moodOptions.find(option => option.value === mood)?.label || mood;
    const actionLabel = actionOptions.find(option => option.value === action)?.label || action;
    const compositionLabel = compositionOptions.find(option => option.value === composition)?.label || composition;
    
    // Convert array selections to labels
    const effectLabels = effects?.map(effect => 
      effectOptions.find(option => option.value === effect)?.label || effect
    ).join(", ");
    
    // Characters
    const characterDescriptions = characters?.map(char => 
      char.name + (char.action ? ` ${char.action}` : '') + (char.position ? ` positioned at ${char.position}` : '')
    ).join(", ");
    
    // Construct the prompt
    let prompt = `${styleLabel} style ${sceneTypeLabel} scene with ${cameraLabel} camera angle using ${perspectiveLabel} perspective. `;
    
    prompt += `Set during ${timeOfDayLabel} with ${lightingLabel} lighting and ${weatherLabel} weather. `;
    
    prompt += `Scene takes place in a ${environmentLabel} environment with a ${moodLabel} mood. `;
    
    if (action) {
      prompt += `The scene shows ${actionLabel} action. `;
    }
    
    if (characters && characters.length > 0) {
      prompt += `Characters in scene: ${characterDescriptions}. `;
    }
    
    if (effects && effects.length > 0) {
      prompt += `Visual effects: ${effectLabels}. `;
    }
    
    prompt += `Use ${compositionLabel} composition.`;
    
    return prompt;
  };
  
  // Save scene to database
  const saveScene = async () => {
    if (!formState.title) {
      toast.error("Please provide a title for your scene");
      return;
    }
    
    try {
      setSavingScene(true);
      
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save a scene");
        return;
      }
      
      // In a real implementation, this would save to your database
      // For now, we'll simulate success
      
      // Create scene in Supabase
      const { data, error } = await supabase
        .from('scenes')
        .insert({
          title: formState.title,
          description: formState.description || null,
          project_id: formState.projectId,
          user_id: user.id,
          metadata: scene,
          image_url: generationHistory[currentImageIndex] || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Scene saved successfully!");
      
      // Optionally, redirect to scene detail page
      // router.push(`/studio/scenes/${data.id}`);
      
    } catch (error: any) {
      console.error("Error saving scene:", error);
      toast.error(error.message || "Failed to save scene. Please try again.");
    } finally {
      setSavingScene(false);
    }
  };
  
  // Random seed generator
  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 1000000);
    setCurrentSeed(seed);
    return seed;
  };
  
  // Handle changes to scene attributes
  const handleSceneChange = (field: keyof SceneMetadata, value: any) => {
    setScene(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (field: keyof SceneMetadata, value: string) => {
    setScene(prev => {
      const currentValues = prev[field] as string[] || [];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };
  
  // Check if multi-select option is selected
  const isOptionSelected = (field: keyof SceneMetadata, value: string) => {
    const currentValues = scene[field] as string[] || [];
    return currentValues.includes(value);
  };
  
  // Add character to scene
  const addCharacterToScene = (character: Partial<Character>) => {
    if (!character.id || !character.name) return;
    
    const sceneCharacter: SceneCharacter = {
      id: character.id,
      name: character.name,
      position: 'center',
      pose: 'standing',
      expression: 'neutral',
      action: '',
    };
    
    setScene(prev => ({
      ...prev,
      characters: [...(prev.characters || []), sceneCharacter]
    }));
    
    setCharacterMenuOpen(false);
  };
  
  // Remove character from scene
  const removeCharacterFromScene = (characterId: string) => {
    setScene(prev => ({
      ...prev,
      characters: (prev.characters || []).filter(c => c.id !== characterId)
    }));
  };
  
  // Add dialog to scene
  const addDialogToScene = () => {
    if (!currentDialogText.trim()) {
      toast.error("Dialog text cannot be empty");
      return;
    }
    
    const dialog: SceneDialog = {
      character_id: currentDialogCharacter || undefined,
      character_name: currentDialogCharacter 
        ? scene.characters?.find(c => c.id === currentDialogCharacter)?.name 
        : 'Narrator',
      text: currentDialogText,
      bubble_type: currentDialogType,
      position: currentDialogPosition,
    };
    
    setScene(prev => ({
      ...prev,
      dialog: [...(prev.dialog || []), dialog]
    }));
    
    // Reset dialog form
    setCurrentDialogText('');
    setCurrentDialogCharacter(null);
    setCurrentDialogType('normal');
    setCurrentDialogPosition('center');
    setDialogEditorOpen(false);
  };
  
  // Remove dialog from scene
  const removeDialogFromScene = (index: number) => {
    setScene(prev => ({
      ...prev,
      dialog: (prev.dialog || []).filter((_, i) => i !== index)
    }));
  };
  
  // Random scene generator
  const generateRandomScene = () => {
    const randomScene: Partial<SceneMetadata> = {
      panel_layout: generateRandomLayout(),
      style: getRandomArrayElement(sceneStyles).value,
      scene_type: getRandomArrayElement(sceneTypeOptions).value,
      camera_angle: getRandomArrayElement(cameraAngleOptions).value,
      perspective: getRandomArrayElement(perspectiveOptions).value,
      time_of_day: getRandomArrayElement(timeOfDayOptions).value,
      lighting: getRandomArrayElement(lightingOptions).value,
      weather: getRandomArrayElement(weatherOptions).value,
      environment: getRandomArrayElement(environmentOptions).value,
      mood: getRandomArrayElement(moodOptions).value,
      action: getRandomArrayElement(actionOptions).value,
      effects: getRandomArrayElements(effectOptions, Math.floor(Math.random() * 3)).map(item => item.value),
      composition: getRandomArrayElement(compositionOptions).value,
    };
    
    setScene(prevScene => ({
      ...randomScene,
      characters: prevScene.characters || [],
      dialog: prevScene.dialog || [],
    }));
  };
  
  // Helper function to get random array element
  const getRandomArrayElement = <T extends any>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Helper function to get multiple random array elements
  const getRandomArrayElements = <T extends any>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Copy prompt to clipboard
  const copyPromptToClipboard = () => {
    const prompt = buildPrompt();
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard");
  };
  
  // Update quality preset
  const updateQualityPreset = (preset: string) => {
    setSelectedQuality(preset);
    
    // Update generation params based on preset
    switch (preset) {
      case 'draft':
        setGenerationParams(prev => ({
          ...prev,
          num_inference_steps: 20,
        }));
        break;
      case 'standard':
        setGenerationParams(prev => ({
          ...prev,
          num_inference_steps: 30,
        }));
        break;
      case 'high':
        setGenerationParams(prev => ({
          ...prev,
          num_inference_steps: 50,
        }));
        break;
    }
  };
  
  // Export scene
  const exportScene = (format: string) => {
    // In a real implementation, this would convert the scene to the selected format
    // For now, we'll just show a toast
    toast.success(`Scene exported as ${format.toUpperCase()}`);
  };
  
  // Update canvas dimensions when aspect ratio changes
  useEffect(() => {
    const selectedRatio = sceneAspectRatios.find(ratio => ratio.value === aspectRatio);
    if (selectedRatio) {
      setGenerationParams(prev => ({
        ...prev,
        width: selectedRatio.width,
        height: selectedRatio.height,
      }));
    }
  }, [aspectRatio]);
  
  return (
    <ProtectedRoute>
      <div className="container max-w-full px-0 py-0 overflow-hidden">
        <div className="flex flex-row h-[calc(100vh-64px)]">
          {/* Left Panel - Scene Configuration */}
          <div className={`${leftPanelCollapsed ? 'w-0' : 'w-80'} h-full flex flex-col transition-all duration-300 border-r`}>
            {!leftPanelCollapsed && (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Scene Generator</h2>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={generateRandomScene} className="h-8 w-8">
                          <Dice3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Randomize Scene</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setLeftPanelCollapsed(true)} className="h-8 w-8">
                          <PanelLeftClose className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Collapse Panel</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-5 sticky top-0 z-10">
                      {sceneGeneratorTabs.map(tab => (
                        <TabsTrigger key={tab.id} value={tab.id} className="text-xs py-1">
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {/* Layout & Style Tab */}
                    <TabsContent value="layout" className="p-4 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Panel Layout</Label>
                          <Select 
                            value={scene.panel_layout as string} 
                            onValueChange={value => handleSceneChange('panel_layout', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {panelLayoutOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {panelLayoutOptions.find(option => option.value === scene.panel_layout)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Art Style</Label>
                          <Select 
                            value={scene.style as string} 
                            onValueChange={value => handleSceneChange('style', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sceneStyles.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {sceneStyles.find(option => option.value === scene.style)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Scene Type</Label>
                          <Select 
                            value={scene.scene_type as string} 
                            onValueChange={value => handleSceneChange('scene_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sceneTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {sceneTypeOptions.find(option => option.value === scene.scene_type)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Camera Angle</Label>
                          <Select 
                            value={scene.camera_angle as string} 
                            onValueChange={value => handleSceneChange('camera_angle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {cameraAngleOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Perspective</Label>
                          <Select 
                            value={scene.perspective as string} 
                            onValueChange={value => handleSceneChange('perspective', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {perspectiveOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Composition</Label>
                          <Select 
                            value={scene.composition as string} 
                            onValueChange={value => handleSceneChange('composition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {compositionOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {compositionOptions.find(option => option.value === scene.composition)?.description}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Setting & Mood Tab */}
                    <TabsContent value="setting" className="p-4 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Environment</Label>
                          <Select 
                            value={scene.environment as string} 
                            onValueChange={value => handleSceneChange('environment', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {environmentOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Time of Day</Label>
                          <Select 
                            value={scene.time_of_day as string} 
                            onValueChange={value => handleSceneChange('time_of_day', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOfDayOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {timeOfDayOptions.find(option => option.value === scene.time_of_day)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Weather</Label>
                          <Select 
                            value={scene.weather as string} 
                            onValueChange={value => handleSceneChange('weather', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {weatherOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Lighting</Label>
                          <Select 
                            value={scene.lighting as string} 
                            onValueChange={value => handleSceneChange('lighting', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {lightingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {lightingOptions.find(option => option.value === scene.lighting)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Mood</Label>
                          <Select 
                            value={scene.mood as string} 
                            onValueChange={value => handleSceneChange('mood', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {moodOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {moodOptions.find(option => option.value === scene.mood)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Action</Label>
                          <Select 
                            value={scene.action as string} 
                            onValueChange={value => handleSceneChange('action', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actionOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Visual Effects (Select multiple)</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {effectOptions.slice(0, 8).map(option => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`effect-${option.value}`} 
                                  checked={isOptionSelected('effects', option.value)}
                                  onCheckedChange={() => handleMultiSelectChange('effects', option.value)}
                                />
                                <Label htmlFor={`effect-${option.value}`} className="text-sm">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          
                          <Accordion type="single" collapsible className="mt-2">
                            <AccordionItem value="more-effects">
                              <AccordionTrigger className="text-xs">More Effects</AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {effectOptions.slice(8).map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`effect-${option.value}`} 
                                        checked={isOptionSelected('effects', option.value)}
                                        onCheckedChange={() => handleMultiSelectChange('effects', option.value)}
                                      />
                                      <Label htmlFor={`effect-${option.value}`} className="text-sm">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Characters Tab */}
                    <TabsContent value="characters" className="p-4 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Characters in Scene</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCharacterMenuOpen(true)}
                            className="h-8"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Character
                          </Button>
                        </div>
                        
                        {scene.characters && scene.characters.length > 0 ? (
                          <div className="space-y-3">
                            {scene.characters.map((character, index) => (
                              <div 
                                key={index} 
                                className="border rounded-md p-3 relative group hover:border-primary/50 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                      {character.name?.[0] || "?"}
                                    </div>
                                    <div>
                                      <p className="font-medium">{character.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {character.pose} • {character.expression}
                                      </p>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => removeCharacterFromScene(character.id || '')}
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Position</Label>
                                    <Select 
                                      value={character.position || 'center'} 
                                      onValueChange={value => {
                                        setScene(prev => {
                                          const updatedCharacters = [...(prev.characters || [])];
                                          updatedCharacters[index] = { ...updatedCharacters[index], position: value };
                                          return { ...prev, characters: updatedCharacters };
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {characterPositionOptions.map(option => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Action</Label>
                                    <Input 
                                      value={character.action || ''} 
                                      onChange={e => {
                                        setScene(prev => {
                                          const updatedCharacters = [...(prev.characters || [])];
                                          updatedCharacters[index] = { ...updatedCharacters[index], action: e.target.value };
                                          return { ...prev, characters: updatedCharacters };
                                        });
                                      }}
                                      placeholder="e.g., running"
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-md p-6 text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-4">No characters added yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setCharacterMenuOpen(true)}
                            >
                              Add Character
                            </Button>
                          </div>
                        )}
                        
                        {/* Character Selection Dialog */}
                        <Drawer open={characterMenuOpen} onOpenChange={setCharacterMenuOpen}>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Select Character</DrawerTitle>
                              <DrawerDescription>Choose a character to add to your scene</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                              {mockCharacters.map(character => (
                                <div
                                  key={character.id}
                                  className="border rounded-md p-3 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all"
                                  onClick={() => addCharacterToScene(character)}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                      {character.name?.[0] || "?"}
                                    </div>
                                    <div>
                                      <p className="font-medium">{character.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {character.metadata?.gender}, {character.metadata?.age}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <DrawerFooter>
                              <Button variant="outline" onClick={() => setCharacterMenuOpen(false)}>
                                Cancel
                              </Button>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </TabsContent>
                    
                    {/* Dialog Tab */}
                    <TabsContent value="dialog" className="p-4 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Dialog Bubbles</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setDialogEditorOpen(true)}
                            className="h-8"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Dialog
                          </Button>
                        </div>
                        
                        {scene.dialog && scene.dialog.length > 0 ? (
                          <div className="space-y-3">
                            {scene.dialog.map((dialog, index) => (
                              <div 
                                key={index} 
                                className="border rounded-md p-3 relative group hover:border-primary/50 transition-all"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                                      {dialogBubbleOptions.find(o => o.value === dialog.bubble_type)?.label || 'Speech'}
                                    </Badge>
                                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                                      {characterPositionOptions.find(o => o.value === dialog.position)?.label || 'Center'}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {dialog.character_name || 'Narrator'}:
                                    </span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => removeDialogFromScene(index)}
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <p className="text-sm italic">{dialog.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-md p-6 text-center">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-4">No dialog added yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setDialogEditorOpen(true)}
                            >
                              Add Dialog
                            </Button>
                          </div>
                        )}
                        
                        {/* Dialog Editor Dialog */}
                        <Dialog open={dialogEditorOpen} onOpenChange={setDialogEditorOpen}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Dialog</DialogTitle>
                              <DialogDescription>Add speech or thought bubbles to your characters</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Character</Label>
                                <Select 
                                  value={currentDialogCharacter || ""} 
                                  onValueChange={setCurrentDialogCharacter}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a character" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Narrator</SelectItem>
                                    {scene.characters?.map(character => (
                                      <SelectItem key={character.id} value={character.id || ""}>
                                        {character.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Dialog Text</Label>
                                <Textarea 
                                  value={currentDialogText}
                                  onChange={e => setCurrentDialogText(e.target.value)}
                                  placeholder="Enter dialog text..."
                                  className="resize-none h-24"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Bubble Type</Label>
                                  <Select 
                                    value={currentDialogType} 
                                    onValueChange={setCurrentDialogType}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dialogBubbleOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Position</Label>
                                  <Select 
                                    value={currentDialogPosition} 
                                    onValueChange={setCurrentDialogPosition}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {characterPositionOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDialogEditorOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={addDialogToScene}
                                disabled={!currentDialogText.trim()}
                              >
                                Add Dialog
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TabsContent>
                    
                    {/* Advanced Tab */}
                    <TabsContent value="advanced" className="p-4 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Quality Preset</Label>
                          <RadioGroup 
                            value={selectedQuality} 
                            onValueChange={updateQualityPreset}
                            className="grid gap-2"
                          >
                            {sceneQualityPresets.map(preset => (
                              <div 
                                key={preset.value} 
                                className="flex flex-col space-y-1 border rounded-md p-3 cursor-pointer hover:bg-muted/50" 
                                onClick={() => updateQualityPreset(preset.value)}
                              >
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem value={preset.value} id={`quality-${preset.value}`} />
                                  <Label htmlFor={`quality-${preset.value}`} className="font-medium">
                                    {preset.label}
                                  </Label>
                                </div>
                                <p className="text-xs text-muted-foreground pl-6">{preset.description}</p>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Aspect Ratio</Label>
                            <Select 
                              value={aspectRatio} 
                              onValueChange={setAspectRatio}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sceneAspectRatios.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Guidance Scale (Creativity vs. Precision)</Label>
                            <span className="text-sm font-medium">{selectedGuidance}</span>
                          </div>
                          <Slider 
                            value={[selectedGuidance]} 
                            min={1} 
                            max={15} 
                            step={1} 
                            onValueChange={value => {
                              setSelectedGuidance(value[0]);
                              setGenerationParams(prev => ({
                                ...prev,
                                guidance_scale: value[0]
                              }));
                            }} 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>More Creative</span>
                            <span>More Precise</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="seed">Generation Seed</Label>
                            <div className="flex items-center gap-2">
                              <Switch 
                                id="random-seed" 
                                checked={randomSeed} 
                                onCheckedChange={setRandomSeed} 
                              />
                              <Label htmlFor="random-seed" className="text-xs">Random</Label>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              id="seed" 
                              type="number" 
                              placeholder="Enter seed number..." 
                              value={currentSeed || ''} 
                              onChange={e => setCurrentSeed(Number(e.target.value))}
                              disabled={randomSeed}
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={generateRandomSeed}
                              disabled={randomSeed}
                            >
                              <Shuffle className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            A seed allows you to regenerate the same scene with different settings.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>View Prompt</Label>
                            <Button variant="outline" size="sm" onClick={() => setShowPrompt(!showPrompt)}>
                              {showPrompt ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                              {showPrompt ? "Hide Prompt" : "Show Prompt"}
                            </Button>
                          </div>
                          
                          {showPrompt && (
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="prompt">Generated Prompt</Label>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={copyPromptToClipboard}
                                    className="h-7 text-xs"
                                  >
                                    <ClipboardCheck className="h-3 w-3 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                                <Textarea 
                                  id="prompt" 
                                  ref={promptRef}
                                  value={buildPrompt()}
                                  className="h-24 resize-none text-xs font-mono"
                                  readOnly
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="negative-prompt">Negative Prompt</Label>
                                <Textarea 
                                  id="negative-prompt" 
                                  ref={negativePromptRef}
                                  value={generationParams.negative_prompt}
                                  onChange={e => setGenerationParams(prev => ({
                                    ...prev,
                                    negative_prompt: e.target.value
                                  }))}
                                  className="h-16 resize-none text-xs font-mono"
                                  placeholder="Enter terms to exclude from generation..."
                                />
                                <p className="text-xs text-muted-foreground">
                                  Terms to exclude from the generation (e.g., "bad anatomy, blurry, low quality")
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="p-4 border-t">
                  <Button 
                    onClick={generateScene} 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Scene
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
          
          {/* Collapse/Expand Button when collapsed */}
          {leftPanelCollapsed && (
            <div className="absolute left-2 top-4 z-50">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setLeftPanelCollapsed(false)}
                className="h-8 w-8 rounded-full bg-card shadow-md"
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Main Canvas Area */}
          <div className="flex-1 overflow-hidden bg-background relative p-8 flex flex-col">
            {/* Preview Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Scene Preview</h2>
              
              <div className="flex items-center gap-2">
                {generationHistory.length > 1 && (
                  <div className="flex items-center mr-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex <= 0}
                      className="h-8 w-8"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 text-sm">
                      {currentImageIndex + 1}/{generationHistory.length}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentImageIndex(Math.min(generationHistory.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex >= generationHistory.length - 1}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sceneExportFormats.map(format => (
                      <DropdownMenuItem
                        key={format.value}
                        onClick={() => exportScene(format.value)}
                        disabled={generationHistory.length === 0}
                      >
                        {format.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={generationHistory.length === 0}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Scene</DialogTitle>
                      <DialogDescription>
                        Enter details to save this scene to your collection.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="scene-title">Scene Title <span className="text-destructive">*</span></Label>
                        <Input 
                          id="scene-title" 
                          placeholder="Enter a title for your scene" 
                          value={formState.title}
                          onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scene-description">Description</Label>
                        <Textarea 
                          id="scene-description" 
                          placeholder="Enter a description for your scene..." 
                          className="resize-none h-20"
                          value={formState.description}
                          onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-select">Add to Project (Optional)</Label>
                        <Select 
                          value={formState.projectId || ""} 
                          onValueChange={value => setFormState(prev => ({ ...prev, projectId: value || null }))}
                        >
                          <SelectTrigger id="project-select">
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Project</SelectItem>
                            {sampleProjects.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        onClick={saveScene} 
                        disabled={savingScene || !formState.title}
                      >
                        {savingScene ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Scene
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div 
                ref={canvasRef} 
                className="relative rounded-lg overflow-hidden shadow-lg border bg-muted/50"
                style={{
                  width: generationParams.width,
                  height: generationParams.height,
                  maxWidth: '100%',
                  maxHeight: 'calc(100vh - 190px)',
                  aspectRatio: `${generationParams.width} / ${generationParams.height}`,
                }}
              >
                {generationHistory.length > 0 && currentImageIndex >= 0 ? (
                  <div className="w-full h-full relative">
                    {/* Panel Layout Grid */}
                    {scene.panel_layout !== 'single' && (
                      <div 
                        className="absolute inset-0 grid" 
                        style={{
                          gridTemplateColumns: `repeat(${getPanelLayout(scene.panel_layout as string).cols}, 1fr)`,
                          gridTemplateRows: `repeat(${getPanelLayout(scene.panel_layout as string).rows}, 1fr)`,
                          gridTemplateAreas: getPanelLayout(scene.panel_layout as string).areas,
                          gap: '4px',
                        }}
                      >
                        {Array.from({ length: getNumberOfPanels(scene.panel_layout as string) }).map((_, index) => (
                          <div 
                            key={index} 
                            className={`
                              border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/20 
                              transition-colors cursor-pointer flex items-center justify-center
                            `}
                            style={{ gridArea: String.fromCharCode(97 + index) }}
                            onClick={() => {
                              setSelectedPanel(index);
                              setPanelEditorOpen(true);
                            }}
                          >
                            <span className="text-sm text-white/70">Panel {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Dialog bubbles visualization */}
                    {scene.dialog && scene.dialog.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {scene.dialog.map((dialog, index) => {
                          let positionClass = "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"; // Default center
                          
                          // Position based on dialog position
                          switch (dialog.position) {
                            case 'left': positionClass = "left-6 top-1/2 -translate-y-1/2"; break;
                            case 'right': positionClass = "right-6 top-1/2 -translate-y-1/2"; break;
                            case 'top': positionClass = "left-1/2 top-6 -translate-x-1/2"; break;
                            case 'bottom': positionClass = "left-1/2 bottom-6 -translate-x-1/2"; break;
                            case 'top-left': positionClass = "left-6 top-6"; break;
                            case 'top-right': positionClass = "right-6 top-6"; break;
                            case 'bottom-left': positionClass = "left-6 bottom-6"; break;
                            case 'bottom-right': positionClass = "right-6 bottom-6"; break;
                          }
                          
                          let bubbleClass = "bg-white rounded-2xl"; // Default bubble
                          
                          // Bubble style based on type
                          switch (dialog.bubble_type) {
                            case 'thought': bubbleClass = "bg-white rounded-3xl"; break;
                            case 'shouting': bubbleClass = "bg-white"; break;
                            case 'whisper': bubbleClass = "bg-white/70 border border-dashed"; break;
                            case 'narrator': bubbleClass = "bg-black/80 text-white"; break;
                          }
                          
                          return (
                            <div 
                              key={index} 
                              className={`absolute ${positionClass} ${bubbleClass} p-2 px-3 w-40 text-center text-xs shadow-md`}
                            >
                              {dialog.text}
                              {dialog.character_name && dialog.bubble_type !== 'narrator' && (
                                <div className="text-[10px] text-gray-500 mt-1">
                                  — {dialog.character_name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* This would be the generated image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                    
                    {/* In a real implementation, this would use the actual image URL */}
                    {/* <Image 
                      src={generationHistory[currentImageIndex]} 
                      alt="Generated scene" 
                      fill 
                      className="object-cover" 
                    /> */}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <LayoutGrid className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Scene Generated Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      Configure your scene settings on the left panel and click "Generate Scene" to create your manga panel.
                    </p>
                    <Button 
                      onClick={generateScene} 
                      disabled={isGenerating}
                      variant="outline"
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4" />
                          Generate Now
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons below canvas */}
            {generationHistory.length > 0 && (
              <div className="mt-4 flex gap-2 justify-center">
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button variant="outline" className="gap-1">
                  <Copy className="h-4 w-4" />
                  Variations
                </Button>
                <Button variant="outline" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit in Panel Editor
                </Button>
              </div>
            )}
            
            {/* Recently Generated Scenes (would show in a real implementation) */}
            {generationHistory.length > 1 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Generation History</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {generationHistory.map((image, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "relative h-32 border rounded-md cursor-pointer transition-all",
                        currentImageIndex === index ? "ring-2 ring-primary" : "hover:border-primary/50"
                      )}
                      style={{
                        aspectRatio: `${generationParams.width} / ${generationParams.height}`,
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      
                      {/* In a real implementation, this would use the actual image URLs */}
                      {/* <Image 
                        src={image} 
                        alt={`Generated scene ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      /> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Panel Editor Drawer */}
        <Drawer open={panelEditorOpen} onOpenChange={setPanelEditorOpen} modal={false}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>Panel {selectedPanel !== null ? selectedPanel + 1 : ''} Editor</DrawerTitle>
              <DrawerDescription>
                Edit the content and settings for this specific panel
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="text-center text-muted-foreground mb-6">
                Individual panel editing would be implemented here, allowing specific customization of each panel.
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setPanelEditorOpen(false)}>
                  Close Editor
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </ProtectedRoute>
  );
}