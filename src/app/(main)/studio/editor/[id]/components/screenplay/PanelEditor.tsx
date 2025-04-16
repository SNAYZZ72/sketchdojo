// src/app/(main)/studio/editor/[id]/components/screenplay/PanelEditor.tsx
"use client";

import React, { useState } from 'react';
import { HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/types/projects';
import { formatDistanceToNow } from 'date-fns';

interface PanelEditorProps {
  panel: Panel;
  onUpdate: (panel: Panel) => void;
  onGenerate: () => void;
  creditsRemaining: number;
}

export function PanelEditor({
  panel,
  onUpdate,
  onGenerate,
  creditsRemaining = 3
}: PanelEditorProps) {
  const [description, setDescription] = useState(panel.description);
  const [location, setLocation] = useState(panel.location);
  const [time, setTime] = useState(panel.time);
  const [cameraAngle, setCameraAngle] = useState(panel.camera_angle);
  const [cameraShot, setCameraShot] = useState(panel.camera_shot);
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onUpdate({
      ...panel,
      description: e.target.value
    });
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onUpdate({
      ...panel,
      location: e.target.value
    });
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    onUpdate({
      ...panel,
      time: e.target.value
    });
  };
  
  const handleCameraAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraAngle(e.target.value);
    onUpdate({
      ...panel,
      camera_angle: e.target.value
    });
  };
  
  const handleCameraShotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraShot(e.target.value);
    onUpdate({
      ...panel,
      camera_shot: e.target.value
    });
  };
  
  return (
    <div className="flex-1 p-4 border-r border-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Badge className="bg-green-600 text-white mr-2">Panel {panel.order}</Badge>
          <span className="text-muted-foreground text-sm">Last updated {formatDistanceToNow(new Date(), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Ready!</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onGenerate}>
            Generate <Badge className="ml-1 bg-background text-foreground h-5 w-5 flex items-center justify-center text-xs p-0">{creditsRemaining}</Badge>
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-1 flex items-center">
          Panel Image <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
        </h3>
        <div className="border border-border rounded-md h-40 flex items-center justify-center bg-muted">
          {panel.image_url ? (
            <img 
              src={panel.image_url} 
              alt={`Panel ${panel.order}`}
              className="object-contain max-h-full w-auto"
            />
          ) : (
            <p className="text-muted-foreground">Panel image will appear here</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-1 flex items-center">
          Description <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
        </h3>
        <textarea 
          className="w-full h-32 bg-muted border border-input rounded-md p-2 text-sm"
          placeholder="Describe what's happening in this panel..."
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            Location <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
          </h3>
          <input 
            type="text" 
            className="w-full bg-muted border border-input rounded-md p-2 text-sm"
            value={location}
            onChange={handleLocationChange}
            placeholder="Panel location"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            Time <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
          </h3>
          <input 
            type="text" 
            className="w-full bg-muted border border-input rounded-md p-2 text-sm"
            value={time}
            onChange={handleTimeChange}
            placeholder="Time of day"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            Camera Angle <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
          </h3>
          <input 
            type="text" 
            className="w-full bg-muted border border-input rounded-md p-2 text-sm"
            value={cameraAngle}
            onChange={handleCameraAngleChange}
            placeholder="Camera angle"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            Camera Shot <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
          </h3>
          <input 
            type="text" 
            className="w-full bg-muted border border-input rounded-md p-2 text-sm"
            value={cameraShot}
            onChange={handleCameraShotChange}
            placeholder="Camera shot type"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          Characters in the panel <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
        </h3>
        <div className="flex items-center">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Character
          </Button>
        </div>
      </div>
    </div>
  );
}