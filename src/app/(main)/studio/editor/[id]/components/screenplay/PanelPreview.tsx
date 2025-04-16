// src/app/(main)/studio/editor/[id]/components/screenplay/PanelPreview.tsx
"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/types/projects';

interface PanelPreviewProps {
  panel: Panel | null;
  onPreviewFullComic: () => void;
  onExport: () => void;
}

export function PanelPreview({
  panel,
  onPreviewFullComic,
  onExport
}: PanelPreviewProps) {
  return (
    <div className="w-1/3 p-4">
      <h2 className="font-bold mb-4">Dashtoon Preview</h2>
      
      <div className="bg-muted rounded-md h-[500px] overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-xs">
            {panel && (
              <>
                <div className="bg-white rounded-lg p-3 mb-3 text-center relative">
                  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                    <div className="w-4 h-4 overflow-hidden">
                      <div className="bg-white w-4 h-4 transform rotate-45 origin-top-left"></div>
                    </div>
                  </div>
                  <p className="text-black text-sm">One round left. The fate of this war rests on this shot.</p>
                </div>
                
                <div className="mb-3">
                  <div className="w-full h-48 bg-card rounded overflow-hidden flex items-center justify-center">
                    {panel.image_url ? (
                      <img 
                        src={panel.image_url} 
                        alt={`Panel ${panel.order}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" size="sm" onClick={onPreviewFullComic}>
          Preview Full Comic
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          Export
        </Button>
      </div>
    </div>
  );
}