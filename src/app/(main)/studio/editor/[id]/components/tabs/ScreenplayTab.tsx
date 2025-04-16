// src/app/(main)/studio/editor/[id]/components/tabs/ScreenplayTab.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { PanelList } from '../screenplay/PanelList';
import { PanelEditor } from '../screenplay/PanelEditor';
import { PanelPreview } from '../screenplay/PanelPreview';
import { Panel } from '@/types/projects';
import { toast } from 'sonner';

// Mock data for initial panels (this would come from API)
const mockPanels: Panel[] = [
  {
    id: '1',
    order: 1,
    description: 'A close-up view of Private James Hawkins lying prone on a dusty rooftop. His face is covered in sweat and grime, eyes focused intently through the scope of his sniper rifle. The scorching sun beats down, casting harsh shadows.',
    location: 'Rooftop in a war-torn city',
    time: 'Midday',
    camera_angle: 'Top-down view, slightly angled',
    camera_shot: 'Close up shot',
    characters: ['James Hawkins'],
    generated: false
  },
  {
    id: '2',
    order: 2,
    description: 'Looking through his rifle scope, James spots a target moving across the street below.',
    location: 'Rooftop in a war-torn city',
    time: 'Midday',
    camera_angle: 'First-person view through scope',
    camera_shot: 'POV shot',
    characters: ['James Hawkins'],
    generated: false
  },
  {
    id: '3',
    order: 3,
    description: 'The target moves across the street, unaware of being watched.',
    location: 'Street below the rooftop',
    time: 'Midday',
    camera_angle: 'Through rifle scope',
    camera_shot: 'Medium shot',
    characters: ['Target'],
    generated: false
  }
];

interface ScreenplayTabProps {
  projectId: string;
}

export function ScreenplayTab({ projectId }: ScreenplayTabProps) {
  const [panels, setPanels] = useState<Panel[]>(mockPanels);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(mockPanels[0]?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedPanel = panels.find(panel => panel.id === selectedPanelId) || null;
  
  useEffect(() => {
    // Here you would fetch panels from the API
    // This is where we'd make the API call in a real implementation
  }, [projectId]);
  
  const handleSelectPanel = (panel: Panel) => {
    setSelectedPanelId(panel.id);
  };
  
  const handleUpdatePanel = (updatedPanel: Panel) => {
    setPanels(panels.map(panel => 
      panel.id === updatedPanel.id ? updatedPanel : panel
    ));
  };
  
  const handleAddPanel = () => {
    const newOrder = panels.length > 0 
      ? Math.max(...panels.map(p => p.order)) + 1 
      : 1;
    
    const newPanel: Panel = {
      id: `new-${Date.now()}`, // Temporary ID that would be replaced after API call
      order: newOrder,
      description: '',
      location: '',
      time: '',
      camera_angle: '',
      camera_shot: '',
      characters: [],
      generated: false
    };
    
    setPanels([...panels, newPanel]);
    setSelectedPanelId(newPanel.id);
  };
  
  const handleGeneratePanel = async () => {
    if (!selectedPanel) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        // Update the panel with the generated image
        const updatedPanel = {
          ...selectedPanel,
          generated: true,
          // This would be the URL from the API
          image_url: 'https://picsum.photos/800/600' 
        };
        
        setPanels(panels.map(panel => 
          panel.id === updatedPanel.id ? updatedPanel : panel
        ));
        
        toast.success('Panel generated successfully!');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating panel:', error);
      toast.error('Failed to generate panel');
      setIsLoading(false);
    }
  };
  
  const handlePreviewFullComic = () => {
    toast.info('Full comic preview is not available in this demo');
  };
  
  const handleExportComic = () => {
    toast.info('Export functionality is not available in this demo');
  };
  
  return (
    <div className="flex-1 flex">
      <PanelList 
        panels={panels}
        selectedPanelId={selectedPanelId}
        onSelectPanel={handleSelectPanel}
        onAddPanel={handleAddPanel}
      />
      
      {selectedPanel && (
        <PanelEditor
          panel={selectedPanel}
          onUpdate={handleUpdatePanel}
          onGenerate={handleGeneratePanel}
          creditsRemaining={3}
        />
      )}
      
      <PanelPreview
        panel={selectedPanel}
        onPreviewFullComic={handlePreviewFullComic}
        onExport={handleExportComic}
      />
    </div>
  );
}