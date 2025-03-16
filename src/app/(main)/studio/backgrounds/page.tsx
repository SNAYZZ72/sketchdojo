"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import ProtectedRoute from '@/components/global/protected-route';
import Image from 'next/image';

// Constants
import {
  backgroundGeneratorTabs,
  backgroundTypes,
  backgroundStyles,
  getSettingsByType,
  timeOfDayOptions,
  weatherOptions,
  moodOptions,
  perspectiveOptions,
  lightingOptions,
  seasonOptions,
  environmentElements,
  architecturalElements,
  propElements,
  themeOptions,
  qualityPresets,
  guidanceSettings,
  defaultGenerationParams,
  backgroundAspectRatios,
  backgroundExportFormats,
  Background,
  BackgroundMetadata
} from '@/components/constants/backgrounds';

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
  SunMoon,
  Cloud,
  LucideIcon,
  Mountain,
  TreePine,
  Building,
  Palette,
  Wind,
  Combine,
  FileSliders
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

export default function BackgroundGeneratorPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Background state
  const [background, setBackground] = useState<Partial<BackgroundMetadata>>({
    background_type: 'outdoor',
    style: 'anime',
    setting: 'city_street',
    time_of_day: 'afternoon',
    weather: 'clear',
    mood: 'peaceful',
    perspective: 'eye_level',
    lighting: 'natural',
    season: 'spring',
    environment_elements: [],
    architectural_elements: [],
    props: [],
    theme: 'adventure',
    additional_details: '',
  });
  
  // Settings list - updates based on background type
  const [settingsList, setSettingsList] = useState<any[]>([]);
  
  // Update settings list when background type changes
  useEffect(() => {
    if (background.background_type) {
      const newSettings = getSettingsByType(background.background_type);
      setSettingsList(newSettings);
      
      // If current setting is not in the new list, select the first setting
      if (newSettings.length > 0 && !newSettings.some(s => s.value === background.setting)) {
        setBackground(prev => ({
          ...prev,
          setting: newSettings[0].value
        }));
      }
    }
  }, [background.background_type]);
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    projectId: null as string | null,
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [generationParams, setGenerationParams] = useState(defaultGenerationParams);
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [selectedGuidance, setSelectedGuidance] = useState(7);
  const [aspectRatio, setAspectRatio] = useState(backgroundAspectRatios[0].value);
  const [randomSeed, setRandomSeed] = useState(true);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [savingBackground, setSavingBackground] = useState(false);
  
  // Refs
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const negativePromptRef = useRef<HTMLTextAreaElement>(null);
  
  // Sample projects for dropdown (this would be fetched from your database)
  const sampleProjects = [
    { id: 'project-1', title: 'Midnight Samurai' },
    { id: 'project-2', title: 'Cyber Academy' },
    { id: 'project-3', title: 'Dragon\'s Journey' },
  ];
  
  // Generate background image
  const generateBackground = async () => {
    try {
      setIsGenerating(true);
      
      // Build the prompt from background attributes
      const prompt = buildPrompt();
      
      // Enhance the prompt for better DALL-E results
      const enhancedPrompt = `Create a high-quality ${backgroundStyles.find(s => s.value === background.style)?.label || 'anime'} background illustration with the following details: ${prompt} The image should be detailed, atmospheric, and suitable for a manga or comic book scene.`;
      
      // Call our API route to generate the image
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          size: getSelectedAspectRatioSize(),
          quality: selectedQuality === 'high' ? 'hd' : 'standard',
          n: 1,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate background');
      }
      
      // Get the generated image URL
      const generatedImageUrl = result.data[0].url;
      
      // Add to generation history
      setGenerationHistory(prev => [...prev, generatedImageUrl]);
      setCurrentImageIndex(generationHistory.length);
      
      // Store the prompt and parameters used
      setBackground(prev => ({
        ...prev,
        prompt_used: enhancedPrompt,
        negative_prompt: generationParams.negative_prompt,
        generation_params: {
          ...generationParams,
          seed: randomSeed ? Math.floor(Math.random() * 1000000) : currentSeed
        }
      }));
      
      toast.success("Background generated successfully!");
      
    } catch (error) {
      console.error("Error generating background:", error);
      toast.error("Failed to generate background. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

    // Get the correct size for the selected aspect ratio
    const getSelectedAspectRatioSize = () => {
      const ratio = backgroundAspectRatios.find(r => r.value === aspectRatio);
      if (ratio) {
        if (ratio.width > ratio.height) {
          return "1792x1024"; // Landscape
        } else if (ratio.height > ratio.width) {
          return "1024x1792"; // Portrait
        }
      }
      return "1024x1024"; // Square (default)
    };
  
  // Build prompt from background attributes
  const buildPrompt = () => {
    const {
      background_type,
      style,
      setting,
      time_of_day,
      weather,
      mood,
      perspective,
      lighting,
      season,
      environment_elements,
      architectural_elements,
      props,
      theme,
      additional_details
    } = background;
    
    // Get the label values instead of the value codes
    const typeLabel = backgroundTypes.find(option => option.value === background_type)?.label || background_type;
    const styleLabel = backgroundStyles.find(option => option.value === style)?.label || style;
    const settingLabel = settingsList.find(option => option.value === setting)?.label || setting;
    const timeLabel = timeOfDayOptions.find(option => option.value === time_of_day)?.label || time_of_day;
    const weatherLabel = weatherOptions.find(option => option.value === weather)?.label || weather;
    const moodLabel = moodOptions.find(option => option.value === mood)?.label || mood;
    const perspectiveLabel = perspectiveOptions.find(option => option.value === perspective)?.label || perspective;
    const lightingLabel = lightingOptions.find(option => option.value === lighting)?.label || lighting;
    const seasonLabel = seasonOptions.find(option => option.value === season)?.label || season;
    const themeLabel = themeOptions.find(option => option.value === theme)?.label || theme;
    
    // Convert array selections to labels
    const environmentLabels = environment_elements?.map(element => 
      environmentElements.find(option => option.value === element)?.label || element
    ).join(", ");
    
    const architecturalLabels = architectural_elements?.map(element => 
      architecturalElements.find(option => option.value === element)?.label || element
    ).join(", ");
    
    const propLabels = props?.map(prop => 
      propElements.find(option => option.value === prop)?.label || prop
    ).join(", ");
    
    // Construct the prompt
    let prompt = `${styleLabel} style ${typeLabel} background, ${settingLabel} setting, `;
    
    if (time_of_day) {
      prompt += `${timeLabel}, `;
    }
    
    if (weather) {
      prompt += `${weatherLabel} weather, `;
    }
    
    if (season) {
      prompt += `${seasonLabel} season, `;
    }
    
    if (mood) {
      prompt += `${moodLabel} atmosphere, `;
    }
    
    if (perspective) {
      prompt += `${perspectiveLabel} perspective, `;
    }
    
    if (lighting) {
      prompt += `${lightingLabel} lighting, `;
    }
    
    if (environment_elements && environment_elements.length > 0) {
      prompt += `with environmental elements: ${environmentLabels}, `;
    }
    
    if (architectural_elements && architectural_elements.length > 0) {
      prompt += `with architectural elements: ${architecturalLabels}, `;
    }
    
    if (props && props.length > 0) {
      prompt += `with props: ${propLabels}, `;
    }
    
    if (theme) {
      prompt += `${themeLabel} theme, `;
    }
    
    if (additional_details) {
      prompt += `Additional details: ${additional_details}, `;
    }
    
    // Add manga-specific keywords
    prompt += `detailed background art, manga background, no characters, establishing shot`;
    
    return prompt;
  };
  
  // Save background to database
  const saveBackground = async () => {
    if (!formState.name) {
      toast.error("Please provide a name for your background");
      return;
    }
    
    try {
      setSavingBackground(true);
      
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save a background");
        return;
      }
      
      // In a real implementation, this would save to your database
      // For now, we'll simulate success
      
      // Create background in Supabase
      const { data, error } = await supabase
        .from('backgrounds')
        .insert({
          name: formState.name,
          description: formState.description || null,
          project_id: formState.projectId,
          user_id: user.id,
          metadata: background,
          image_url: generationHistory[currentImageIndex] || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Background saved successfully!");
      
      // Optionally, redirect to background detail page
      // router.push(`/studio/backgrounds/${data.id}`);
      
    } catch (error: any) {
      console.error("Error saving background:", error);
      toast.error(error.message || "Failed to save background. Please try again.");
    } finally {
      setSavingBackground(false);
    }
  };
  
  // Random seed generator
  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 1000000);
    setCurrentSeed(seed);
    return seed;
  };
  
  // Handle changes to background traits
  const handleBackgroundChange = (field: keyof BackgroundMetadata, value: any) => {
    setBackground(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (field: keyof BackgroundMetadata, value: string) => {
    setBackground(prev => {
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
  const isOptionSelected = (field: keyof BackgroundMetadata, value: string) => {
    const currentValues = background[field] as string[] || [];
    return currentValues.includes(value);
  };
  
  // Random background generator
  const generateRandomBackground = () => {
    const randomBackground: Partial<BackgroundMetadata> = {
      background_type: getRandomArrayElement(backgroundTypes).value,
      style: getRandomArrayElement(backgroundStyles).value,
      time_of_day: getRandomArrayElement(timeOfDayOptions).value,
      weather: getRandomArrayElement(weatherOptions).value,
      mood: getRandomArrayElement(moodOptions).value,
      perspective: getRandomArrayElement(perspectiveOptions).value,
      lighting: getRandomArrayElement(lightingOptions).value,
      season: getRandomArrayElement(seasonOptions).value,
      environment_elements: getRandomArrayElements(environmentElements, Math.floor(Math.random() * 3) + 1).map(item => item.value),
      architectural_elements: getRandomArrayElements(architecturalElements, Math.floor(Math.random() * 2)).map(item => item.value),
      props: getRandomArrayElements(propElements, Math.floor(Math.random() * 2)).map(item => item.value),
      theme: getRandomArrayElement(themeOptions).value,
    };
    
    // Set the background type first
    setBackground(prev => ({
      ...prev,
      background_type: randomBackground.background_type
    }));
    
    // Get settings for the random background type
    const newSettings = getSettingsByType(randomBackground.background_type as string);
    setSettingsList(newSettings);
    
    // Now set the rest of the attributes, including a random setting
    setTimeout(() => {
      setBackground(prev => ({
        ...prev,
        ...randomBackground,
        setting: getRandomArrayElement(newSettings).value
      }));
    }, 0);
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
  
  // Update aspect ratio
  const updateAspectRatio = (ratio: string) => {
    setAspectRatio(ratio);
    
    // Update dimensions based on selected aspect ratio
    const selectedRatio = backgroundAspectRatios.find(r => r.value === ratio);
    if (selectedRatio) {
      setGenerationParams(prev => ({
        ...prev,
        width: selectedRatio.width,
        height: selectedRatio.height
      }));
    }
  };
  
  // Export background
  const exportBackground = (format: string) => {
    // Check if there's an image to export
    if (generationHistory.length === 0 || currentImageIndex < 0) {
      toast.error("No background image to export");
      return;
    }

    const imageUrl = generationHistory[currentImageIndex];
    
    // Handle different export formats
    switch (format) {
      case 'png':
        downloadImage(imageUrl, `background-${Date.now()}.png`);
        break;
      case 'jpg':
        // For JPG, we would ideally convert the image, but for now we'll just download it
        downloadImage(imageUrl, `background-${Date.now()}.jpg`);
        break;
      case 'json':
        // Export background data as JSON
        downloadJSON({
          name: formState.name || 'Unnamed Background',
          description: formState.description || '',
          attributes: background,
          imageUrl: imageUrl
        }, `background-data-${Date.now()}.json`);
        break;
      default:
        downloadImage(imageUrl, `background-${Date.now()}.png`);
    }
    
    toast.success(`Background ${format === 'json' ? 'exported' : 'opened'} as ${format.toUpperCase()}`);
  };

  // Helper function to download an image or open in new tab
  const downloadImage = (url: string, filename: string) => {
    // Open the image in a new tab instead of downloading
    window.open(url, '_blank');
    
    // Show success message
    toast.success(`Image opened in new tab`);
  };

  // Helper function to download JSON data
  const downloadJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  
  // Get icon for tabs
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'basic':
        return <Mountain className="h-4 w-4" />;
      case 'environment':
        return <TreePine className="h-4 w-4" />;
      case 'atmosphere':
        return <Cloud className="h-4 w-4" />;
      case 'advanced':
        return <FileSliders className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Panel - Background Configuration */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Background Generator</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={generateRandomBackground}>
                    <Dice3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Randomize Background</TooltipContent>
              </Tooltip>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Background Attributes</CardTitle>
                <CardDescription>Customize your background's appearance and mood</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    {backgroundGeneratorTabs.map(tab => (
                      <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                        {getTabIcon(tab.id)}
                        <span className="hidden sm:inline ml-1">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {/* Basic Tab */}
                  <TabsContent value="basic" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Background Type</Label>
                        <Select 
                          value={background.background_type as string} 
                          onValueChange={value => handleBackgroundChange('background_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backgroundTypes.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Art Style</Label>
                        <Select 
                          value={background.style as string} 
                          onValueChange={value => handleBackgroundChange('style', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backgroundStyles.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Setting</Label>
                        <Select 
                          value={background.setting as string} 
                          onValueChange={value => handleBackgroundChange('setting', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {settingsList.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select 
                          value={background.theme as string} 
                          onValueChange={value => handleBackgroundChange('theme', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {themeOptions.map(option => (
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
                          value={background.perspective as string} 
                          onValueChange={value => handleBackgroundChange('perspective', value)}
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
                    </div>
                  </TabsContent>
                  
                  {/* Environment Tab */}
                  <TabsContent value="environment" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Season</Label>
                        <Select 
                          value={background.season as string} 
                          onValueChange={value => handleBackgroundChange('season', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {seasonOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Environment Elements (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {environmentElements.slice(0, 8).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`env-${option.value}`} 
                                checked={isOptionSelected('environment_elements', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('environment_elements', option.value)}
                              />
                              <Label htmlFor={`env-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-elements">
                            <AccordionTrigger className="text-xs">More Elements</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {environmentElements.slice(8).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`env-${option.value}`} 
                                      checked={isOptionSelected('environment_elements', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('environment_elements', option.value)}
                                    />
                                    <Label htmlFor={`env-${option.value}`} className="text-sm">
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Architectural Elements (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {architecturalElements.slice(0, 8).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`arch-${option.value}`} 
                                checked={isOptionSelected('architectural_elements', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('architectural_elements', option.value)}
                              />
                              <Label htmlFor={`arch-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-architectural">
                            <AccordionTrigger className="text-xs">More Elements</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {architecturalElements.slice(8).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`arch-${option.value}`} 
                                      checked={isOptionSelected('architectural_elements', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('architectural_elements', option.value)}
                                    />
                                    <Label htmlFor={`arch-${option.value}`} className="text-sm">
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Props (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {propElements.slice(0, 8).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`prop-${option.value}`} 
                                checked={isOptionSelected('props', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('props', option.value)}
                              />
                              <Label htmlFor={`prop-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-props">
                            <AccordionTrigger className="text-xs">More Props</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {propElements.slice(8).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`prop-${option.value}`} 
                                      checked={isOptionSelected('props', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('props', option.value)}
                                    />
                                    <Label htmlFor={`prop-${option.value}`} className="text-sm">
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
                  
                  {/* Atmosphere Tab */}
                  <TabsContent value="atmosphere" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Time of Day</Label>
                        <Select 
                          value={background.time_of_day as string} 
                          onValueChange={value => handleBackgroundChange('time_of_day', value)}
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
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Weather</Label>
                        <Select 
                          value={background.weather as string} 
                          onValueChange={value => handleBackgroundChange('weather', value)}
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
                          value={background.lighting as string} 
                          onValueChange={value => handleBackgroundChange('lighting', value)}
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
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Mood</Label>
                        <Select 
                          value={background.mood as string} 
                          onValueChange={value => handleBackgroundChange('mood', value)}
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
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Additional Details</Label>
                        <Textarea 
                          placeholder="Enter any additional details about your background..."
                          value={background.additional_details as string || ''}
                          onChange={e => handleBackgroundChange('additional_details', e.target.value)}
                          className="h-24 resize-none"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Advanced Tab */}
                  <TabsContent value="advanced" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quality Preset</Label>
                        <RadioGroup 
                          value={selectedQuality} 
                          onValueChange={updateQualityPreset}
                          className="grid gap-2"
                        >
                          {qualityPresets.map(preset => (
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
                            onValueChange={updateAspectRatio}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {backgroundAspectRatios.map(option => (
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
                          A seed allows you to regenerate the same background with different settings.
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
                                Terms to exclude from the generation (e.g., "characters, people, animals, blurry, low quality")
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-4">
                <Button 
                  onClick={generateBackground} 
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
                      Generate Background
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Panel - Background Preview */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
            <Card className="w-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Background Preview</CardTitle>
                  
                  <div className="flex items-center gap-2">
                    {generationHistory.length > 1 && (
                      <div className="flex items-center mr-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          disabled={currentImageIndex <= 0}
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
                        {backgroundExportFormats.map(format => (
                          <DropdownMenuItem
                            key={format.value}
                            onClick={() => exportBackground(format.value)}
                            disabled={generationHistory.length === 0}
                          >
                            {format.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center">
                  <div className="relative w-full max-w-4xl border rounded-md overflow-hidden bg-muted">
                    <div className="aspect-video w-full">
                      {generationHistory.length > 0 && currentImageIndex >= 0 ? (
                        <div className="relative w-full h-full">
                          {/* Display the generated image */}                          
                          <Image 
                            src={generationHistory[currentImageIndex]} 
                            alt="Generated background" 
                            className="w-full h-full object-contain" 
                            width={generationParams.width}
                            height={generationParams.height}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                          <Mountain className="h-16 w-16 text-muted-foreground/40 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Background Generated Yet</h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            Configure your background attributes and click "Generate Background" to see a preview.
                          </p>
                          <Button 
                            onClick={generateBackground} 
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
                </div>
              </CardContent>
              {generationHistory.length > 0 && (
                <CardFooter className="flex flex-col gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Background
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Background</DialogTitle>
                        <DialogDescription>
                          Enter details to save this background to your collection.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="background-name">Background Name <span className="text-destructive">*</span></Label>
                          <Input 
                            id="background-name" 
                            placeholder="Enter a name for your background" 
                            value={formState.name}
                            onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="background-description">Description</Label>
                          <Textarea 
                            id="background-description" 
                            placeholder="Enter a description for your background..." 
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
                          onClick={saveBackground} 
                          disabled={savingBackground || !formState.name}
                        >
                          {savingBackground ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Background
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={generateBackground} 
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={async () => {
                        try {
                          setIsGenerating(true);
                          
                          // Get the current prompt
                          const prompt = buildPrompt();
                          
                          // Enhance the prompt for variations
                          const enhancedPrompt = `Create a high-quality ${backgroundStyles.find(s => s.value === background.style)?.label || 'anime'} background illustration with the following details: ${prompt} The image should be detailed, atmospheric, and suitable for a manga or comic book scene. Create a variation of the existing background.`;
                          
                          // Call our API route to generate variations
                          const response = await fetch('/api/generate-background', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              prompt: enhancedPrompt,
                              size: getSelectedAspectRatioSize(),
                              quality: selectedQuality === 'high' ? 'hd' : 'standard',
                              n: 1,
                            }),
                          });
                          
                          const result = await response.json();
                          
                          if (!response.ok) {
                            throw new Error(result.error || 'Failed to generate background variations');
                          }
                          
                          // Get the generated image URL
                          const generatedImageUrl = result.data[0].url;
                          
                          // Add to generation history
                          setGenerationHistory(prev => [...prev, generatedImageUrl]);
                          setCurrentImageIndex(generationHistory.length);
                          
                          toast.success("Background variation generated successfully!");
                          
                        } catch (error: any) {
                          console.error("Error generating background variation:", error);
                          toast.error(error.message || "Failed to generate background variation. Please try again.");
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Variations
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
            
            {/* Recently Generated Backgrounds (would show in a real implementation) */}
            {generationHistory.length > 1 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Generation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {generationHistory.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "relative min-w-[200px] aspect-video border rounded-md cursor-pointer transition-all",
                          currentImageIndex === index ? "ring-2 ring-primary" : "hover:border-primary/50"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      >                        
                        {/* In a real implementation, this would use the actual image URLs */}
                        <Image 
                          src={imageUrl} 
                          alt={`Generated background ${index + 1}`} 
                          className="w-full h-full object-cover" 
                          width={generationParams.width}
                          height={generationParams.height}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper function to conditionally apply classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};