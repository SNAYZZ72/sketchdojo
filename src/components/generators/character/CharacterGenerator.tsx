"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import ProtectedRoute from '@/components/global/protected-route';
import { Dice3, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

// Custom Components
import CharacterAttributesForm from './CharacterAttributesForm';
import PreviewCard from '../common/PreviewCard';
import GenerationHistory from '../common/GenerationHistory';
import ProFeaturesCard from '../common/ProFeaturesCard';

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
  characterAspectRatios,
  characterExportFormats,
  CharacterMetadata
} from '@/components/constants/characters';

import {
  qualityPresets,
  guidanceSettings,
  defaultGenerationParams,
} from '@/components/constants/generator-common';

const CharacterGenerator: React.FC = () => {
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [generationParams, setGenerationParams] = useState(defaultGenerationParams);
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [selectedGuidance, setSelectedGuidance] = useState(7);
  const [aspectRatio, setAspectRatio] = useState(characterAspectRatios[0].value);
  const [randomSeed, setRandomSeed] = useState(true);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [savingCharacter, setSavingCharacter] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  
  // Show animation first time
  useEffect(() => {
    setShowLoadingAnimation(true);
    setTimeout(() => {
      setShowLoadingAnimation(false);
    }, 2000);
  }, []);
  
  // Sample projects for dropdown
  const sampleProjects = [
    { id: 'project-1', title: 'Midnight Samurai' },
    { id: 'project-2', title: 'Cyber Academy' },
    { id: 'project-3', title: 'Dragon\'s Journey' },
  ];
  
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate character');
      }
      
      const result = await response.json();
      
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
const getSelectedAspectRatioSize = (): "1024x1024" | "1792x1024" | "1024x1792" => {
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
      
      // Simulate success with a delay for demo
      setTimeout(() => {
        toast.success("Character saved successfully!");
        setSavingCharacter(false);
      }, 1500);
      
    } catch (error: any) {
      console.error("Error saving character:", error);
      toast.error(error.message || "Failed to save character. Please try again.");
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
  
  // Random character generator
  const generateRandomCharacter = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
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
      setIsGenerating(false);
      toast.success("Random character traits generated!");
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
        openInNewTab(imageUrl);
        break;
      case 'transparent_png':
        // For transparent PNG, we would need to process the image to remove background
        // This is a simplified version that just shows a toast and opens the image
        toast.info("Transparent PNG requires background removal processing");
        openInNewTab(imageUrl);
        break;
      case 'character_sheet':
        // For a character sheet, we would generate a PDF with character details
        // This is a simplified version that just shows a toast and opens the image
        toast.info("Character sheet export would include character details in PDF format");
        openInNewTab(imageUrl);
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
        openInNewTab(imageUrl);
    }
    
    toast.success(`Character ${format === 'json' ? 'exported' : 'opened'} as ${format.toUpperCase()}`);
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
      
      // Build the prompt from character attributes
      let prompt = buildPrompt();
      
      // Enhance the prompt for variations
      const enhancedPrompt = `Create a high-quality ${characterStyles.find(s => s.value === character.style)?.label || 'anime'} character illustration with the following details: ${prompt} The image should be detailed, expressive, and fit for a manga or comic book. Create a variation of the existing character.`;
      
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate character variation');
      }
      
      const result = await response.json();
      
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
  };
  
  return (
    <ProtectedRoute>
      <AnimatePresence>
        {showLoadingAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center mb-6"
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
              >
                <Wand2 className="h-16 w-16 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-white mb-2">Preparing Character Generator</h2>
              <p className="text-white/60">Loading AI tools and assets...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container max-w-full px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Panel - Character Configuration */}
          <motion.div 
            className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Character Generator</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={generateRandomCharacter}
                      className="hover:border-primary hover:text-primary transition-colors duration-300"
                      disabled={isGenerating}
                    >
                      <Dice3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Randomize Character</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <CharacterAttributesForm
              character={character}
              onCharacterChange={handleCharacterChange}
              onMultiSelectChange={handleMultiSelectChange}
              characterTabs={characterGeneratorTabs}
              genderOptions={genderOptions}
              ageRangeOptions={ageRangeOptions}
              characterStyles={characterStyles}
              hairColorOptions={hairColorOptions}
              eyeColorOptions={eyeColorOptions}
              skinToneOptions={skinToneOptions}
              bodyTypeOptions={bodyTypeOptions}
              clothingOptions={clothingOptions}
              poseOptions={poseOptions}
              expressionOptions={expressionOptions}
              backgroundOptions={backgroundOptions}
              facialFeatureOptions={facialFeatureOptions}
              personalityTraitOptions={personalityTraitOptions}
              accessoryOptions={accessoryOptions}
              isGenerating={isGenerating}
              onGenerate={generateCharacter}
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
              characterAspectRatios={characterAspectRatios}
            />
          </motion.div>
          
          {/* Right Panel - Character Preview */}
          <motion.div 
            className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PreviewCard
              type="character"
              generationHistory={generationHistory}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              isGenerating={isGenerating}
              onGenerate={generateCharacter}
              onVariation={generateVariation}
              exportOptions={characterExportFormats}
              onExport={exportCharacter}
              generationParams={generationParams}
              formState={formState}
              setFormState={setFormState}
              isSaving={savingCharacter}
              onSave={saveCharacter}
              projects={sampleProjects}
              imageClassName="aspect-[3/4] w-full max-w-md"
            />
            
            <GenerationHistory
              history={generationHistory}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
              generationParams={generationParams}
              type="character"
            />
            
            <ProFeaturesCard 
              type="character"
              features={[
                "Higher resolution character generation",
                "Character training for consistent style",
                "Unlimited character generations"
              ]}
            />
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default CharacterGenerator;