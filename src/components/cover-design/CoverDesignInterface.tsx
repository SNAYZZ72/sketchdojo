import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

// Components
import CoverPreview from './CoverPreview';
import DesignOptionsPanel from './DesignOptionsPanel';
import CoverChatInterface from './CoverChatInterface';
import ExportOptions from './ExportOptions';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for the cover settings
interface CoverSettings {
  title: string;
  subtitle: string;
  authorName: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  fontFamily: string;
  layout: string;
  illustration: null | string;
  illustrationPrompt: string;
  effects: string[];
  textEffects: string[];
}

// Default cover settings
const defaultCoverSettings: CoverSettings = {
  title: 'My Manga Title',
  subtitle: 'Volume 1',
  authorName: '',
  backgroundColor: '#121218',
  titleColor: '#FFFFFF',
  subtitleColor: '#CCCCCC',
  fontFamily: 'serif',
  layout: 'centered',
  illustration: null,
  illustrationPrompt: '',
  effects: [],
  textEffects: [],
};

// Sample cover templates
const coverTemplates = [
  {
    id: 'action',
    name: 'Action Manga',
    thumbnail: '/assets/covers/template-action.jpg',
    settings: {
      ...defaultCoverSettings,
      backgroundColor: '#1E1E2C',
      layout: 'dynamic',
      effects: ['glow', 'texture'],
    }
  },
  {
    id: 'romance',
    name: 'Romance',
    thumbnail: '/assets/covers/template-romance.jpg',
    settings: {
      ...defaultCoverSettings,
      backgroundColor: '#2C1E28',
      titleColor: '#FF9EAA',
      layout: 'centered',
      effects: ['soft-light', 'particles'],
    }
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    thumbnail: '/assets/covers/template-fantasy.jpg',
    settings: {
      ...defaultCoverSettings,
      backgroundColor: '#1E2C28',
      titleColor: '#A9FFAA',
      layout: 'asymmetric',
      effects: ['magical', 'depth'],
    }
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    thumbnail: '/assets/covers/template-scifi.jpg',
    settings: {
      ...defaultCoverSettings,
      backgroundColor: '#0A0A1E',
      titleColor: '#56AAFF',
      layout: 'futuristic',
      effects: ['glitch', 'hologram'],
    }
  },
];

export default function CoverDesignInterface() {
  const [activeTab, setActiveTab] = useState('design');
  const [coverSettings, setCoverSettings] = useState(defaultCoverSettings);
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();
  
  // Update cover settings
  const updateSettings = (newSettings: Partial<typeof defaultCoverSettings>) => {
    setCoverSettings({ ...coverSettings, ...newSettings });
  };
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = coverTemplates.find(t => t.id === templateId);
    if (template) {
      setCoverSettings(template.settings);
      toast.success(`Applied ${template.name} template`);
    }
  };
  
  // Generate cover from AI
  const generateCover = async (prompt: string) => {
    try {
      setIsGenerating(true);
      
      // This would be an API call to your AI service
      // For demo, we'll just simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder for generated cover URL
      const newCoverUrl = `https://source.unsplash.com/random/600x900/?manga,${prompt.replace(' ', ',')}`;
      
      setGeneratedCovers(prev => [...prev, newCoverUrl]);
      setSelectedCover(newCoverUrl);
      
      toast.success("Cover generated successfully!");
    } catch (error) {
      console.error("Error generating cover:", error);
      toast.error("Failed to generate cover. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save cover to project
  const saveCover = async (projectId?: string) => {
    if (!selectedCover) {
      toast.error("No cover selected to save");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Placeholder for actual save functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(projectId 
        ? "Cover saved to project" 
        : "Cover saved to your library");
    } catch (error) {
      console.error("Error saving cover:", error);
      toast.error("Failed to save cover. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Export cover
  const exportCover = (format: string) => {
    if (!selectedCover) {
      toast.error("No cover selected to export");
      return;
    }
    
    // Placeholder for actual export functionality
    toast.success(`Cover exported as ${format.toUpperCase()}`);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left section - Chat and Options */}
      <div className="w-full lg:w-1/2 space-y-6">
        <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="mt-4">
            <DesignOptionsPanel 
              settings={coverSettings} 
              updateSettings={updateSettings}
              templates={coverTemplates}
              applyTemplate={applyTemplate}
              isGenerating={isGenerating}
            />
          </TabsContent>
          
          <TabsContent value="assistant" className="mt-4">
            <CoverChatInterface 
              onGenerate={generateCover} 
              isGenerating={isGenerating}
            />
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <ExportOptions 
              onSave={saveCover} 
              onExport={exportCover}
              isSaving={isSaving}
              hasSelection={!!selectedCover}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right section - Cover Preview */}
      <div className="w-full lg:w-1/2">
        <CoverPreview 
          settings={coverSettings}
          generatedCovers={generatedCovers}
          selectedCover={selectedCover}
          setSelectedCover={setSelectedCover}
        />
      </div>
    </div>
  );
}