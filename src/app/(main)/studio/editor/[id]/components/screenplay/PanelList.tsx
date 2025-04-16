// src/app/(main)/studio/editor/[id]/components/screenplay/PanelList.tsx
"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/types/projects';
import { cn } from '@/lib/utils';

interface PanelItemProps {
  panel: Panel;
  isSelected: boolean;
  onSelect: (panel: Panel) => void;
}

function PanelItem({ panel, isSelected, onSelect }: PanelItemProps) {
  return (
    <div 
      className={cn(
        "border rounded-md p-3 mb-3 cursor-pointer",
        isSelected 
          ? "border-primary bg-primary/10" 
          : "border-border hover:bg-accent/10"
      )}
      onClick={() => onSelect(panel)}
    >
      <h3 className="font-medium">Panel {panel.order}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {panel.description.substring(0, 60)}
        {panel.description.length > 60 ? '...' : ''}
      </p>
    </div>
  );
}

interface PanelListProps {
  panels: Panel[];
  selectedPanelId: string | null;
  onSelectPanel: (panel: Panel) => void;
  onAddPanel: () => void;
}

export function PanelList({ 
  panels, 
  selectedPanelId, 
  onSelectPanel,
  onAddPanel
}: PanelListProps) {
  return (
    <div className="w-1/4 border-r border-border p-4">
      <h2 className="font-bold mb-4">Story</h2>
      
      {panels.map((panel) => (
        <PanelItem
          key={panel.id}
          panel={panel}
          isSelected={panel.id === selectedPanelId}
          onSelect={onSelectPanel}
        />
      ))}
      
      <Button className="w-full mt-4" onClick={onAddPanel}>
        <Plus className="h-4 w-4 mr-2" /> Add Panel
      </Button>
    </div>
  );
}