"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import ProtectedRoute from '@/components/global/protected-route';
import { Dice3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

// Custom Components
import BackgroundAttributesForm from './BackgroundAttributesForm';
import PreviewCard from '../common/PreviewCard';
import GenerationHistory from '../common/GenerationHistory';

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
  backgroundAspectRatios,
  backgroundExportFormats,
  BackgroundMetadata
} from '@/components/constants/backgrounds';

import {
  qualityPresets,
  guidanceSettings,
  defaultGenerationParams,
} from '@/components/constants/generator-common';

const BackgroundGenerator: React.FC = () => {
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
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    projectId: null as string | null,
  });
  
  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [generationParams, setGenerationParams] = useState(defaultGenerationParams);
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [selectedGuidance, setSelectedGuidance] = useState(7);
  const [aspectRatio, setAspectRatio] = useState(backgroundAspectRatios[0].value);
  const [randomSeed, setRandomSeed] = useState(true);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [savingBackground, setSavingBackground] = useState(false);
  
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
  
  // Sample projects for dropdown
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate background');
      }
      
      const result = await response.json();
      
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
      
    } catch (error: any) {
      console.error("Error generating background:", error);
      toast.error(error.message || "Failed to generate background. Please try again.");
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
    
    // Add background-specific keywords
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
      
      // Simulate success with a delay for demo
      setTimeout(() => {
        toast.success("Background saved successfully!");
        setSavingBackground(false);
      }, 1500);
      
    } catch (error: any) {
      console.error("Error saving background:", error);
      toast.error(error.message || "Failed to save background. Please try again.");
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
  
  // Random background generator
  const generateRandomBackground = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
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
        setIsGenerating(false);
        toast.success("Random background traits generated!");
      }, 0);
    }, 800);
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
        openInNewTab(imageUrl);
        break;
      case 'jpg':
        openInNewTab(imageUrl);
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
        openInNewTab(imageUrl);
    }
    
    toast.success(`Background ${format === 'json' ? 'exported' : 'opened'} as ${format.toUpperCase()}`);
  };

  // Helper function to open image in new tab
  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
    toast.success(`Image opened in new tab`);
  };

  // Helper function to download JSON data
  const downloadJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Generate variation
  const generateVariation = async () => {
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate background variations');
      }
      
      const result = await response.json();
      
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
  };
  
  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Panel - Background Configuration */}
          <motion.div 
            className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Background Generator</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={generateRandomBackground}
                      className="hover:border-primary hover:text-primary transition-colors duration-300"
                      disabled={isGenerating}
                    >
                      <Dice3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Randomize Background</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <BackgroundAttributesForm
              background={background}
              onBackgroundChange={handleBackgroundChange}
              onMultiSelectChange={handleMultiSelectChange}
              settingsList={settingsList}
              backgroundTypes={backgroundTypes}
              backgroundStyles={backgroundStyles}
              timeOfDayOptions={timeOfDayOptions}
              weatherOptions={weatherOptions}
              moodOptions={moodOptions}
              perspectiveOptions={perspectiveOptions}
              lightingOptions={lightingOptions}
              seasonOptions={seasonOptions}
              environmentElements={environmentElements}
              architecturalElements={architecturalElements}
              propElements={propElements}
              themeOptions={themeOptions}
              isGenerating={isGenerating}
              onGenerate={generateBackground}
              onRandomize={generateRandomBackground}
              generationParams={generationParams}
              setGenerationParams={setGenerationParams}
              buildPrompt={buildPrompt}
              copyPromptToClipboard={copyPromptToClipboard}
              selectedQuality={selectedQuality}
              updateQualityPreset={updateQualityPreset}
              selectedGuidance={selectedGuidance}
              setSelectedGuidance={setSelectedGuidance}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              randomSeed={randomSeed}
              setRandomSeed={setRandomSeed}
              currentSeed={currentSeed}
              setCurrentSeed={setCurrentSeed}
              generateRandomSeed={generateRandomSeed}
              qualityPresets={qualityPresets}
              backgroundAspectRatios={backgroundAspectRatios}
            />
          </motion.div>
          
          {/* Right Panel - Background Preview */}
          <motion.div 
            className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PreviewCard
              type="background"
              generationHistory={generationHistory}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              isGenerating={isGenerating}
              onGenerate={generateBackground}
              onVariation={generateVariation}
              exportOptions={backgroundExportFormats}
              onExport={exportBackground}
              generationParams={generationParams}
              formState={formState}
              setFormState={setFormState}
              isSaving={savingBackground}
              onSave={saveBackground}
              projects={sampleProjects}
            />
            
            <GenerationHistory
              history={generationHistory}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
              generationParams={generationParams}
              type="background"
            />
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default BackgroundGenerator;