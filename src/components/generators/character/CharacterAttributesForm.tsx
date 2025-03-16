import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wand2, Loader2 } from 'lucide-react';
import AttributeSelector from '../common/AttributeSelector';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import PromptViewer from '../common/PromptViewer';
import GenerationSettings from '../common/GenerationSettings';
import { CharacterMetadata } from '@/components/constants/characters';

interface CharacterAttributesFormProps {
  character: Partial<CharacterMetadata>;
  onCharacterChange: (field: keyof CharacterMetadata, value: any) => void;
  onMultiSelectChange: (field: keyof CharacterMetadata, value: string) => void;
  characterTabs: any[];
  genderOptions: any[];
  ageRangeOptions: any[];
  characterStyles: any[];
  hairColorOptions: any[];
  eyeColorOptions: any[];
  skinToneOptions: any[];
  bodyTypeOptions: any[];
  clothingOptions: any[];
  poseOptions: any[];
  expressionOptions: any[];
  backgroundOptions: any[];
  facialFeatureOptions: any[];
  personalityTraitOptions: any[];
  accessoryOptions: any[];
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
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
  characterAspectRatios: any[];
}

const CharacterAttributesForm: React.FC<CharacterAttributesFormProps> = ({
  character,
  onCharacterChange,
  onMultiSelectChange,
  characterTabs,
  genderOptions,
  ageRangeOptions,
  characterStyles,
  hairColorOptions,
  eyeColorOptions,
  skinToneOptions,
  bodyTypeOptions,
  clothingOptions,
  poseOptions,
  expressionOptions,
  backgroundOptions,
  facialFeatureOptions,
  personalityTraitOptions,
  accessoryOptions,
  isGenerating,
  onGenerate,
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
  characterAspectRatios
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] shadow-md overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/10">
        <CardTitle className="text-lg text-white">Character Attributes</CardTitle>
        <CardDescription className="text-white/60">Customize your character's appearance and traits</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white/5 p-1 rounded-none border-b border-white/10">
            {characterTabs.map((tab, idx) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="text-xs py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Basic Details Tab */}
          <TabsContent value="basic" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Gender</Label>
                <RadioGroup 
                  value={character.gender} 
                  onValueChange={value => onCharacterChange('gender', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {genderOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`gender-${option.value}`} 
                        className="border-white/20 text-primary" 
                      />
                      <Label 
                        htmlFor={`gender-${option.value}`}
                        className="text-white/80 text-sm"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AttributeSelector
                  label="Age Range"
                  options={ageRangeOptions}
                  value={character.age as string}
                  onChange={(value) => onCharacterChange('age', value)}
                />
                
                <AttributeSelector
                  label="Art Style"
                  options={characterStyles}
                  value={character.style as string}
                  onChange={(value) => onCharacterChange('style', value)}
                />
              </div>
              
              <AttributeSelector
                label="Pose"
                options={poseOptions}
                value={character.pose as string}
                onChange={(value) => onCharacterChange('pose', value)}
              />
              
              <AttributeSelector
                label="Expression"
                options={expressionOptions}
                value={character.expression as string}
                onChange={(value) => onCharacterChange('expression', value)}
              />
              
              <AttributeSelector
                label="Background"
                options={backgroundOptions}
                value={character.background as string}
                onChange={(value) => onCharacterChange('background', value)}
              />
            </div>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AttributeSelector
                  label="Hair Color"
                  options={hairColorOptions}
                  value={character.hair_color as string}
                  onChange={(value) => onCharacterChange('hair_color', value)}
                />
                
                <AttributeSelector
                  label="Eye Color"
                  options={eyeColorOptions}
                  value={character.eye_color as string}
                  onChange={(value) => onCharacterChange('eye_color', value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AttributeSelector
                  label="Skin Tone"
                  options={skinToneOptions}
                  value={character.skin_tone as string}
                  onChange={(value) => onCharacterChange('skin_tone', value)}
                />
                
                <AttributeSelector
                  label="Body Type"
                  options={bodyTypeOptions}
                  value={character.body_type as string}
                  onChange={(value) => onCharacterChange('body_type', value)}
                />
              </div>
              
              <AttributeSelector
                label="Clothing Style"
                options={clothingOptions}
                value={character.clothing as string}
                onChange={(value) => onCharacterChange('clothing', value)}
              />
              
              <MultiSelectCheckbox
                label="Facial Features"
                options={facialFeatureOptions}
                selectedValues={character.facial_features as string[] || []}
                onChange={(value) => onMultiSelectChange('facial_features', value)}
                maxVisibleOptions={8}
                moreLabel="More Features"
              />
              
              <MultiSelectCheckbox
                label="Accessories"
                options={accessoryOptions}
                selectedValues={character.accessories as string[] || []}
                onChange={(value) => onMultiSelectChange('accessories', value)}
                maxVisibleOptions={8}
                moreLabel="More Accessories"
              />
            </div>
          </TabsContent>
          
          {/* Personality Tab */}
          <TabsContent value="personality" className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <MultiSelectCheckbox
                label="Personality Traits"
                options={personalityTraitOptions}
                selectedValues={character.personality as string[] || []}
                onChange={(value) => onMultiSelectChange('personality', value)}
                maxVisibleOptions={12}
                moreLabel="More Traits"
              />
              
              <div className="space-y-2">
                <Label className="text-white/80">Additional Details</Label>
                <Textarea 
                  placeholder="Enter any additional details about your character..."
                  value={character.additional_details as string || ''}
                  onChange={e => onCharacterChange('additional_details', e.target.value)}
                  className="h-24 resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="px-6 py-4 space-y-6">
            <GenerationSettings
              qualityPresets={qualityPresets}
              aspectRatios={characterAspectRatios}
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
              Generate Character
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CharacterAttributesForm;