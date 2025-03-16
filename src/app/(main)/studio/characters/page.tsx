"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import ProtectedRoute from '@/components/global/protected-route';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Constants
import {
  characterGeneratorTabs,
  genderOptions,
  ageRangeOptions,
  characterStyles,
  hairColorOptions,
  eyeColorOptions,
  skinToneOptions,
  bodyTypeOptions,
  clothingOptions,
  poseOptions,
  backgroundOptions,
  expressionOptions,
  facialFeatureOptions,
  personalityTraitOptions,
  accessoryOptions,
  qualityPresets,
  guidanceSettings,
  defaultGenerationParams,
  characterAspectRatios,
  characterExportFormats,
  Character,
  CharacterMetadata
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
  Loader2
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

export default function CharacterGeneratorPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Character state
  const [character, setCharacter] = useState<Partial<CharacterMetadata>>({
    gender: 'female',
    age: 'young_adult',
    style: 'anime',
    hair_color: 'black',
    eye_color: 'blue',
    skin_tone: 'light',
    body_type: 'average',
    clothing: 'casual',
    personality: [],
    facial_features: [],
    pose: 'standing',
    background: 'none',
    accessories: [],
    expression: 'neutral',
    additional_details: '',
  });
  
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
  const [aspectRatio, setAspectRatio] = useState(characterAspectRatios[0].value);
  const [randomSeed, setRandomSeed] = useState(true);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [savingCharacter, setSavingCharacter] = useState(false);
  
  // Refs
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const negativePromptRef = useRef<HTMLTextAreaElement>(null);
  
  // Sample projects for dropdown (this would be fetched from your database)
  const sampleProjects = [
    { id: 'project-1', title: 'Midnight Samurai' },
    { id: 'project-2', title: 'Cyber Academy' },
    { id: 'project-3', title: 'Dragon\'s Journey' },
  ];
  
  // Generate character image
  // Generate character image
  const generateCharacter = async () => {
    try {
      setIsGenerating(true);
      
      // Build the prompt from character attributes
      let prompt = buildPrompt();
      
      // Enhance the prompt for better DALL-E results
      const enhancedPrompt = `Create a high-quality ${characterStyles.find(s => s.value === character.style)?.label || 'anime'} character illustration with the following details: ${prompt} The image should be detailed, expressive, and fit for a manga or comic book. Make sure the character is centered and properly framed.`;
      
      // Call our API route to generate the image
      const response = await fetch('/api/generate-character', {
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
        throw new Error(result.error || 'Failed to generate character');
      }
      
      // Get the generated image URL
      const generatedImageUrl = result.data[0].url;
      
      // Add to generation history
      setGenerationHistory(prev => [...prev, generatedImageUrl]);
      setCurrentImageIndex(generationHistory.length);
      
      // Store the prompt and parameters used
      setCharacter(prev => ({
        ...prev,
        prompt_used: enhancedPrompt,
        negative_prompt: generationParams.negative_prompt,
        generation_params: {
          ...generationParams,
          seed: randomSeed ? Math.floor(Math.random() * 1000000) : currentSeed
        }
      }));
      
      toast.success("Character generated successfully!");
      
    } catch (error: any) {
      console.error("Error generating character:", error);
      toast.error(error.message || "Failed to generate character. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Get the correct size for the selected aspect ratio
  const getSelectedAspectRatioSize = () => {
    const ratio = characterAspectRatios.find(r => r.value === aspectRatio);
    if (ratio) {
      if (ratio.width > ratio.height) {
        return "1792x1024"; // Landscape
      } else if (ratio.height > ratio.width) {
        return "1024x1792"; // Portrait
      }
    }
    return "1024x1024"; // Square (default)
  };
  
  // Build prompt from character attributes
  const buildPrompt = () => {
    const {
      gender,
      age,
      style,
      hair_color,
      eye_color,
      skin_tone,
      body_type,
      clothing,
      personality,
      facial_features,
      pose,
      background,
      accessories,
      expression,
      additional_details
    } = character;
    
    // Get the label values instead of the value codes
    const genderLabel = genderOptions.find(option => option.value === gender)?.label || gender;
    const ageLabel = ageRangeOptions.find(option => option.value === age)?.label || age;
    const styleLabel = characterStyles.find(option => option.value === style)?.label || style;
    const hairLabel = hairColorOptions.find(option => option.value === hair_color)?.label || hair_color;
    const eyeLabel = eyeColorOptions.find(option => option.value === eye_color)?.label || eye_color;
    const skinLabel = skinToneOptions.find(option => option.value === skin_tone)?.label || skin_tone;
    const bodyLabel = bodyTypeOptions.find(option => option.value === body_type)?.label || body_type;
    const clothingLabel = clothingOptions.find(option => option.value === clothing)?.label || clothing;
    const poseLabel = poseOptions.find(option => option.value === pose)?.label || pose;
    const expressionLabel = expressionOptions.find(option => option.value === expression)?.label || expression;
    
    // Convert array selections to labels
    const personalityLabels = personality?.map(trait => 
      personalityTraitOptions.find(option => option.value === trait)?.label || trait
    ).join(", ");
    
    const facialLabels = facial_features?.map(feature => 
      facialFeatureOptions.find(option => option.value === feature)?.label || feature
    ).join(", ");
    
    const accessoryLabels = accessories?.map(accessory => 
      accessoryOptions.find(option => option.value === accessory)?.label || accessory
    ).join(", ");
    
    const backgroundLabel = backgroundOptions.find(option => option.value === background)?.label || background;
    
    // Construct the prompt
    let prompt = `${styleLabel} style ${genderLabel} character, ${ageLabel}, with ${hairLabel} hair and ${eyeLabel} eyes. `;
    prompt += `${skinLabel} skin tone, ${bodyLabel} body type, wearing ${clothingLabel} clothing. `;
    
    if (facial_features && facial_features.length > 0) {
      prompt += `Facial features: ${facialLabels}. `;
    }
    
    if (accessories && accessories.length > 0) {
      prompt += `Accessories: ${accessoryLabels}. `;
    }
    
    prompt += `${poseLabel} pose with ${expressionLabel} expression. `;
    
    if (background !== 'none') {
      prompt += `Background: ${backgroundLabel}. `;
    }
    
    if (personality && personality.length > 0) {
      prompt += `Personality traits: ${personalityLabels}. `;
    }
    
    if (additional_details) {
      prompt += `Additional details: ${additional_details}`;
    }
    
    return prompt;
  };
  
  // Save character to database
  const saveCharacter = async () => {
    if (!formState.name) {
      toast.error("Please provide a name for your character");
      return;
    }
    
    try {
      setSavingCharacter(true);
      
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save a character");
        return;
      }
      
      // In a real implementation, this would save to your database
      // For now, we'll simulate success
      
      // Create character in Supabase
      const { data, error } = await supabase
        .from('characters')
        .insert({
          name: formState.name,
          description: formState.description || null,
          project_id: formState.projectId,
          user_id: user.id,
          training_complete: false,
          metadata: character,
          image_url: generationHistory[currentImageIndex] || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Character saved successfully!");
      
      // Optionally, redirect to character detail page
      // router.push(`/studio/characters/${data.id}`);
      
    } catch (error: any) {
      console.error("Error saving character:", error);
      toast.error(error.message || "Failed to save character. Please try again.");
    } finally {
      setSavingCharacter(false);
    }
  };
  
  // Random seed generator
  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 1000000);
    setCurrentSeed(seed);
    return seed;
  };
  
  // Handle changes to character traits
  const handleCharacterChange = (field: keyof CharacterMetadata, value: any) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (field: keyof CharacterMetadata, value: string) => {
    setCharacter(prev => {
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
  const isOptionSelected = (field: keyof CharacterMetadata, value: string) => {
    const currentValues = character[field] as string[] || [];
    return currentValues.includes(value);
  };
  
  // Random character generator
  const generateRandomCharacter = () => {
    const randomCharacter: Partial<CharacterMetadata> = {
      gender: getRandomArrayElement(genderOptions).value,
      age: getRandomArrayElement(ageRangeOptions).value,
      style: getRandomArrayElement(characterStyles).value,
      hair_color: getRandomArrayElement(hairColorOptions).value,
      eye_color: getRandomArrayElement(eyeColorOptions).value,
      skin_tone: getRandomArrayElement(skinToneOptions).value,
      body_type: getRandomArrayElement(bodyTypeOptions).value,
      clothing: getRandomArrayElement(clothingOptions).value,
      personality: getRandomArrayElements(personalityTraitOptions, Math.floor(Math.random() * 3) + 1).map(item => item.value),
      facial_features: getRandomArrayElements(facialFeatureOptions, Math.floor(Math.random() * 2)).map(item => item.value),
      pose: getRandomArrayElement(poseOptions).value,
      background: getRandomArrayElement(backgroundOptions).value,
      accessories: getRandomArrayElements(accessoryOptions, Math.floor(Math.random() * 2)).map(item => item.value),
      expression: getRandomArrayElement(expressionOptions).value,
    };
    
    setCharacter(randomCharacter);
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
  
  // Export character
  const exportCharacter = (format: string) => {
    // Check if there's an image to export
    if (generationHistory.length === 0 || currentImageIndex < 0) {
      toast.error("No character image to export");
      return;
    }

    const imageUrl = generationHistory[currentImageIndex];
    
    // Handle different export formats
    switch (format) {
      case 'png':
        downloadImage(imageUrl, `character-${Date.now()}.png`);
        break;
      case 'transparent_png':
        // For transparent PNG, we would need to process the image to remove background
        // This is a simplified version that just downloads the regular PNG
        toast.info("Transparent PNG requires background removal processing");
        downloadImage(imageUrl, `character-transparent-${Date.now()}.png`);
        break;
      case 'character_sheet':
        // For a character sheet, we would generate a PDF with character details
        // This is a simplified version that just shows a toast
        toast.info("Character sheet export would include character details in PDF format");
        downloadImage(imageUrl, `character-${Date.now()}.png`);
        break;
      case 'json':
        // Export character data as JSON
        downloadJSON({
          name: formState.name || 'Unnamed Character',
          description: formState.description || '',
          attributes: character,
          imageUrl: imageUrl
        }, `character-data-${Date.now()}.json`);
        break;
      default:
        downloadImage(imageUrl, `character-${Date.now()}.png`);
    }
    
    toast.success(`Character ${format === 'json' ? 'exported' : 'opened'} as ${format.toUpperCase()}`);
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
  
  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Panel - Character Configuration */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Character Generator</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={generateRandomCharacter}>
                    <Dice3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Randomize Character</TooltipContent>
              </Tooltip>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Character Attributes</CardTitle>
                <CardDescription>Customize your character's appearance and traits</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    {characterGeneratorTabs.map(tab => (
                      <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {/* Basic Details Tab */}
                  <TabsContent value="basic" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup 
                          value={character.gender} 
                          onValueChange={value => handleCharacterChange('gender', value)}
                          className="grid grid-cols-2 gap-2"
                        >
                          {genderOptions.map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                              <Label htmlFor={`gender-${option.value}`}>{option.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age Range</Label>
                          <Select 
                            value={character.age as string} 
                            onValueChange={value => handleCharacterChange('age', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ageRangeOptions.map(option => (
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
                            value={character.style as string} 
                            onValueChange={value => handleCharacterChange('style', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {characterStyles.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Pose</Label>
                        <Select 
                          value={character.pose as string} 
                          onValueChange={value => handleCharacterChange('pose', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {poseOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Expression</Label>
                        <Select 
                          value={character.expression as string} 
                          onValueChange={value => handleCharacterChange('expression', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {expressionOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Background</Label>
                        <Select 
                          value={character.background as string} 
                          onValueChange={value => handleCharacterChange('background', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backgroundOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Appearance Tab */}
                  <TabsContent value="appearance" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hair Color</Label>
                          <Select 
                            value={character.hair_color as string} 
                            onValueChange={value => handleCharacterChange('hair_color', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {hairColorOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Eye Color</Label>
                          <Select 
                            value={character.eye_color as string} 
                            onValueChange={value => handleCharacterChange('eye_color', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {eyeColorOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Skin Tone</Label>
                          <Select 
                            value={character.skin_tone as string} 
                            onValueChange={value => handleCharacterChange('skin_tone', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {skinToneOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Body Type</Label>
                          <Select 
                            value={character.body_type as string} 
                            onValueChange={value => handleCharacterChange('body_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Clothing Style</Label>
                        <Select 
                          value={character.clothing as string} 
                          onValueChange={value => handleCharacterChange('clothing', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clothingOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Facial Features (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {facialFeatureOptions.slice(0, 8).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`facial-${option.value}`} 
                                checked={isOptionSelected('facial_features', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('facial_features', option.value)}
                              />
                              <Label htmlFor={`facial-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-features">
                            <AccordionTrigger className="text-xs">More Features</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {facialFeatureOptions.slice(8).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`facial-${option.value}`} 
                                      checked={isOptionSelected('facial_features', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('facial_features', option.value)}
                                    />
                                    <Label htmlFor={`facial-${option.value}`} className="text-sm">
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
                        <Label>Accessories (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {accessoryOptions.slice(0, 8).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`accessory-${option.value}`} 
                                checked={isOptionSelected('accessories', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('accessories', option.value)}
                              />
                              <Label htmlFor={`accessory-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-accessories">
                            <AccordionTrigger className="text-xs">More Accessories</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {accessoryOptions.slice(8).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`accessory-${option.value}`} 
                                      checked={isOptionSelected('accessories', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('accessories', option.value)}
                                    />
                                    <Label htmlFor={`accessory-${option.value}`} className="text-sm">
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
                  
                  {/* Personality Tab */}
                  <TabsContent value="personality" className="px-6 py-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Personality Traits (Select multiple)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {personalityTraitOptions.slice(0, 12).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`personality-${option.value}`} 
                                checked={isOptionSelected('personality', option.value)}
                                onCheckedChange={() => handleMultiSelectChange('personality', option.value)}
                              />
                              <Label htmlFor={`personality-${option.value}`} className="text-sm">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="more-traits">
                            <AccordionTrigger className="text-xs">More Traits</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {personalityTraitOptions.slice(12).map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`personality-${option.value}`} 
                                      checked={isOptionSelected('personality', option.value)}
                                      onCheckedChange={() => handleMultiSelectChange('personality', option.value)}
                                    />
                                    <Label htmlFor={`personality-${option.value}`} className="text-sm">
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
                        <Label>Additional Details</Label>
                        <Textarea 
                          placeholder="Enter any additional details about your character..."
                          value={character.additional_details as string || ''}
                          onChange={e => handleCharacterChange('additional_details', e.target.value)}
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
                            onValueChange={setAspectRatio}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {characterAspectRatios.map(option => (
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
                          A seed allows you to regenerate the same character with different settings.
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
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-4">
                <Button 
                  onClick={generateCharacter} 
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
                      Generate Character
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Panel - Character Preview */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
            <Card className="w-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Character Preview</CardTitle>
                  
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
                        {characterExportFormats.map(format => (
                          <DropdownMenuItem
                            key={format.value}
                            onClick={() => exportCharacter(format.value)}
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
                  <div className="relative aspect-[3/4] w-full max-w-md border rounded-md overflow-hidden bg-muted">
                    {generationHistory.length > 0 && currentImageIndex >= 0 ? (
                        <div className="relative w-full h-full">
                          {/* Display the generated image */}
                          <img 
                            src={generationHistory[currentImageIndex]} 
                            alt="Generated character" 
                            className="w-full h-full object-contain"
                            width={generationParams.width}
                            height={generationParams.height} 
                          />
                        </div>
                      ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Character Generated Yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Configure your character attributes and click "Generate Character" to see a preview.
                        </p>
                        <Button 
                          onClick={generateCharacter} 
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
              </CardContent>
              {generationHistory.length > 0 && (
                <CardFooter className="flex flex-col gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Character
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Character</DialogTitle>
                        <DialogDescription>
                          Enter details to save this character to your collection.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="character-name">Character Name <span className="text-destructive">*</span></Label>
                          <Input 
                            id="character-name" 
                            placeholder="Enter a name for your character" 
                            value={formState.name}
                            onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="character-description">Description</Label>
                          <Textarea 
                            id="character-description" 
                            placeholder="Enter a description for your character..." 
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
                          onClick={saveCharacter} 
                          disabled={savingCharacter || !formState.name}
                        >
                          {savingCharacter ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Character
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
                      onClick={generateCharacter} 
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
                          const enhancedPrompt = `Create a high-quality ${characterStyles.find(s => s.value === character.style)?.label || 'anime'} character illustration with the following details: ${prompt} The image should be detailed, expressive, and fit for a manga or comic book. Make sure the character is centered and properly framed. Create a variation of the existing character.`;
                          
                          // Call our API route to generate variations
                          const response = await fetch('/api/generate-character', {
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
                            throw new Error(result.error || 'Failed to generate character variations');
                          }
                          
                          // Get the generated image URL
                          const generatedImageUrl = result.data[0].url;
                          
                          // Add to generation history
                          setGenerationHistory(prev => [...prev, generatedImageUrl]);
                          setCurrentImageIndex(generationHistory.length);
                          
                          toast.success("Character variation generated successfully!");
                          
                        } catch (error: any) {
                          console.error("Error generating character variation:", error);
                          toast.error(error.message || "Failed to generate character variation. Please try again.");
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
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
            
            {/* Recently Generated Characters (would show in a real implementation) */}
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
                            "relative min-w-[150px] h-[200px] border rounded-md cursor-pointer transition-all",
                            currentImageIndex === index ? "ring-2 ring-primary" : "hover:border-primary/50"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Generated character ${index + 1}`} 
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