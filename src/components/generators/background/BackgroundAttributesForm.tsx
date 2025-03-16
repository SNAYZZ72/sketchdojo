import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Mountain, TreePine, Cloud, FileSliders } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { backgroundGeneratorTabs } from '@/components/constants/backgrounds';
import AttributeSelector from '../common/AttributeSelector';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import PromptViewer from '../common/PromptViewer';
import GenerationSettings from '../common/GenerationSettings';
import { BackgroundMetadata } from '@/components/constants/backgrounds';

interface BackgroundAttributesFormProps {
  background: Partial<BackgroundMetadata>;
  onBackgroundChange: (field: keyof BackgroundMetadata, value: any) => void;
  onMultiSelectChange: (field: keyof BackgroundMetadata, value: string) => void;
  settingsList: any[];
  backgroundTypes: any[];
  backgroundStyles: any[];
  timeOfDayOptions: any[];
  weatherOptions: any[];
  moodOptions: any[];
  perspectiveOptions: any[];
  lightingOptions: any[];
  seasonOptions: any[];
  environmentElements: any[];
  architecturalElements: any[];
  propElements: any[];
  themeOptions: any[];
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
  onRandomize: () => void;
  generationParams: any;
  setGenerationParams: (params: any) => void;
  buildPrompt: () => string;
  copyPromptToClipboard: () => void;
  selectedQuality: string;
  updateQualityPreset: (preset: string) => void;
  selectedGuidance: number;
  setSelectedGuidance: (value: number) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  randomSeed: boolean;
  setRandomSeed: (value: boolean) => void;
  currentSeed: number | null;
  setCurrentSeed: (seed: number) => void;
  generateRandomSeed: () => void;
  qualityPresets: any[];
  backgroundAspectRatios: any[];
}

const BackgroundAttributesForm: React.FC<BackgroundAttributesFormProps> = ({
  background,
  onBackgroundChange,
  onMultiSelectChange,
  settingsList,
  backgroundTypes,
  backgroundStyles,
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
  isGenerating,
  onGenerate,
  onRandomize,
  generationParams,
  setGenerationParams,
  buildPrompt,
  copyPromptToClipboard,
  selectedQuality,
  updateQualityPreset,
  selectedGuidance,
  setSelectedGuidance,
  aspectRatio,
  setAspectRatio,
  randomSeed,
  setRandomSeed,
  currentSeed,
  setCurrentSeed,
  generateRandomSeed,
  qualityPresets,
  backgroundAspectRatios
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [showPrompt, setShowPrompt] = useState(false);

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
    <Card className="border border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] shadow-md overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/10">
        <CardTitle className="text-lg text-white">Background Attributes</CardTitle>
        <CardDescription className="text-white/60">Customize your background's appearance and mood</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white/5 p-1 rounded-none border-b border-white/10">
            {backgroundGeneratorTabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="text-xs py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
              >
                {getTabIcon(tab.id)}
                <span className="hidden sm:inline ml-1">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Basic Tab */}
          <TabsContent value="basic" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <AttributeSelector
                label="Background Type"
                options={backgroundTypes}
                value={background.background_type as string}
                onChange={(value) => onBackgroundChange('background_type', value)}
              />
              
              <AttributeSelector
                label="Art Style"
                options={backgroundStyles}
                value={background.style as string}
                onChange={(value) => onBackgroundChange('style', value)}
              />
              
              <AttributeSelector
                label="Setting"
                options={settingsList}
                value={background.setting as string}
                onChange={(value) => onBackgroundChange('setting', value)}
              />
              
              <AttributeSelector
                label="Theme"
                options={themeOptions}
                value={background.theme as string}
                onChange={(value) => onBackgroundChange('theme', value)}
              />
              
              <AttributeSelector
                label="Perspective"
                options={perspectiveOptions}
                value={background.perspective as string}
                onChange={(value) => onBackgroundChange('perspective', value)}
              />
            </div>
          </TabsContent>
          
          {/* Environment Tab */}
          <TabsContent value="environment" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <AttributeSelector
                label="Season"
                options={seasonOptions}
                value={background.season as string}
                onChange={(value) => onBackgroundChange('season', value)}
              />
              
              <MultiSelectCheckbox
                label="Environment Elements (Select multiple)"
                options={environmentElements}
                selectedValues={background.environment_elements as string[] || []}
                onChange={(value) => onMultiSelectChange('environment_elements', value)}
                maxVisibleOptions={8}
                moreLabel="More Elements"
              />
              
              <MultiSelectCheckbox
                label="Architectural Elements (Select multiple)"
                options={architecturalElements}
                selectedValues={background.architectural_elements as string[] || []}
                onChange={(value) => onMultiSelectChange('architectural_elements', value)}
                maxVisibleOptions={8}
                moreLabel="More Elements"
              />
              
              <MultiSelectCheckbox
                label="Props (Select multiple)"
                options={propElements}
                selectedValues={background.props as string[] || []}
                onChange={(value) => onMultiSelectChange('props', value)}
                maxVisibleOptions={8}
                moreLabel="More Props"
              />
            </div>
          </TabsContent>
          
          {/* Atmosphere Tab */}
          <TabsContent value="atmosphere" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <AttributeSelector
                label="Time of Day"
                options={timeOfDayOptions}
                value={background.time_of_day as string}
                onChange={(value) => onBackgroundChange('time_of_day', value)}
              />
              
              <AttributeSelector
                label="Weather"
                options={weatherOptions}
                value={background.weather as string}
                onChange={(value) => onBackgroundChange('weather', value)}
              />
              
              <AttributeSelector
                label="Lighting"
                options={lightingOptions}
                value={background.lighting as string}
                onChange={(value) => onBackgroundChange('lighting', value)}
              />
              
              <AttributeSelector
                label="Mood"
                options={moodOptions}
                value={background.mood as string}
                onChange={(value) => onBackgroundChange('mood', value)}
              />
              
              <div className="space-y-2">
                <Label className="text-white/80">Additional Details</Label>
                <Textarea 
                  placeholder="Enter any additional details about your background..."
                  value={background.additional_details as string || ''}
                  onChange={e => onBackgroundChange('additional_details', e.target.value)}
                  className="h-24 resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="px-6 py-4 space-y-6">
            <GenerationSettings
              qualityPresets={qualityPresets}
              aspectRatios={backgroundAspectRatios}
              selectedQuality={selectedQuality}
              updateQualityPreset={updateQualityPreset}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              guidanceScale={selectedGuidance}
              setGuidanceScale={setSelectedGuidance}
              randomSeed={randomSeed}
              setRandomSeed={setRandomSeed}
              currentSeed={currentSeed}
              setCurrentSeed={setCurrentSeed}
              generateRandomSeed={generateRandomSeed}
            />
            
            <PromptViewer
              showPrompt={showPrompt}
              setShowPrompt={setShowPrompt}
              promptText={buildPrompt()}
              negativePrompt={generationParams.negative_prompt}
              onNegativePromptChange={(value) => setGenerationParams({...generationParams, negative_prompt: value})}
              copyPromptToClipboard={copyPromptToClipboard}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-4 px-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onGenerate} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-white"
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
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Generate a background with the current settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default BackgroundAttributesForm;