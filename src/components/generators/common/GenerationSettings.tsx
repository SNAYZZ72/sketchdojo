import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { themeAwareStyles } from './theme-utils';

interface GenerationSettingsProps {
  qualityPresets: { value: string; label: string; description: string }[];
  aspectRatios: { value: string; label: string; width: number; height: number }[];
  selectedQuality: string;
  updateQualityPreset: (preset: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
  randomSeed: boolean;
  setRandomSeed: (value: boolean) => void;
  currentSeed: number | null;
  setCurrentSeed: (seed: number) => void;
  generateRandomSeed: () => void;
  className?: string;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  qualityPresets,
  aspectRatios,
  selectedQuality,
  updateQualityPreset,
  aspectRatio,
  setAspectRatio,
  guidanceScale,
  setGuidanceScale,
  randomSeed,
  setRandomSeed,
  currentSeed,
  setCurrentSeed,
  generateRandomSeed,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className={themeAwareStyles.form.label}>Quality Preset</Label>
          <RadioGroup 
            value={selectedQuality} 
            onValueChange={updateQualityPreset}
            className="grid gap-2"
          >
            {qualityPresets.map(preset => (
              <div 
                key={preset.value} 
                className={cn(
                  "flex flex-col space-y-1 border rounded-md p-3 cursor-pointer transition-all duration-300",
                  selectedQuality === preset.value 
                    ? "border-primary bg-primary/10" 
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-400 dark:hover:border-white/30"
                )}
                onClick={() => updateQualityPreset(preset.value)}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem 
                    value={preset.value} 
                    id={`quality-${preset.value}`} 
                    className="border-gray-300 dark:border-white/20"
                  />
                  <Label 
                    htmlFor={`quality-${preset.value}`} 
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {preset.label}
                  </Label>
                  {preset.value === 'high' && (
                    <Badge className="ml-auto text-xs bg-gradient-to-r from-primary to-secondary">
                      <Crown className="h-3 w-3 mr-1" /> Pro
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-white/60 pl-6">{preset.description}</p>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className={themeAwareStyles.form.label}>Aspect Ratio</Label>
            <Select 
              value={aspectRatio} 
              onValueChange={setAspectRatio}
            >
              <SelectTrigger className="w-[180px] border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
                {aspectRatios.map(option => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-gray-800 dark:text-white/80 focus:text-gray-900 focus:bg-gray-100 dark:focus:text-white dark:focus:bg-white/10"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className={themeAwareStyles.form.label}>Guidance Scale</Label>
            <span className="text-sm font-medium text-gray-700 dark:text-white/80 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-full min-w-[32px] text-center">
              {guidanceScale}
            </span>
          </div>
          <Slider 
            value={[guidanceScale]} 
            min={1} 
            max={15} 
            step={1} 
            onValueChange={value => setGuidanceScale(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-white/60">
            <span>More Creative</span>
            <span>More Precise</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seed" className={themeAwareStyles.form.label}>Generation Seed</Label>
            <div className="flex items-center gap-2">
              <Switch 
                id="random-seed" 
                checked={randomSeed} 
                onCheckedChange={setRandomSeed}
                className="data-[state=checked]:bg-primary" 
              />
              <Label htmlFor="random-seed" className="text-xs text-gray-700 dark:text-white/80">Random</Label>
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
              className="border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-white/10"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={generateRandomSeed}
              disabled={randomSeed}
              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-600 dark:text-white/60">
            A seed allows you to regenerate the same result with different settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerationSettings;