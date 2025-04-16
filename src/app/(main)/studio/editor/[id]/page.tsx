"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { EditorTab } from '@/types/projects';
import { useProjectData } from './hooks/useProjectData';
import { EditorNavbar } from './components/EditorNavbar';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { StoryTab } from './components/tabs/StoryTab';
import { ScreenplayTab } from './components/tabs/ScreenplayTab';
import { EditorTab as EditorTabComponent } from './components/tabs/EditorTab';
import { CharactersTab } from './components/tabs/CharactersTab';
import { AnimeForgeTab } from './components/tabs/AnimeForgeTab';

export default function MangaEditorPage({ params }: { params: { id: string } }) {
  const { project, stats, isLoading, error, refetch } = useProjectData(params.id);
  const [activeTab, setActiveTab] = useState<EditorTab>('screenplay');
  const [currentEpisode, setCurrentEpisode] = useState('Episode 1');
  const [isSaving, setIsSaving] = useState(false);
  
  // Save the current project state
  const handleSave = async () => {
    if (!project) return;
    
    setIsSaving(true);
    
    try {
      // In a real implementation, this would save the project data to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };
  
  // If loading, show loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // If error, show error state
  if (error || !project) {
    return <ErrorState error={error || 'Project not found'} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <EditorNavbar
        project={project}
        currentEpisode={currentEpisode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        isSaving={isSaving}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-auto">
        {/* Render different main content based on active tab */}
        {activeTab === 'story' && (
          <StoryTab projectId={params.id} project={project} />
        )}
        
        {activeTab === 'screenplay' && (
          <ScreenplayTab projectId={params.id} />
        )}
        
        {activeTab === 'editor' && (
          <EditorTabComponent projectId={params.id} />
        )}
        
        {activeTab === 'characters' && (
          <CharactersTab projectId={params.id} />
        )}
        
        {activeTab === 'anime-forge' && (
          <AnimeForgeTab projectId={params.id} />
        )}
      </main>
    </div>
  );
}