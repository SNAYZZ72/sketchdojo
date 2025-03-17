// src/app/(main)/studio/projects/create/components/TemplateSelection.tsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

// Define types for your template
interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  // Add any other properties your template might have
}

// Define prop types
interface TemplateSelectionProps {
  onSelect: (templateId: string) => void;
  onPreview: (template: Template) => void;
  selectedTemplate: string | null;
  templates: Template[]; // Pass templates as a prop instead of using a global variable
}

export function TemplateSelection({ 
  onSelect, 
  onPreview, 
  selectedTemplate,
  templates 
}: TemplateSelectionProps) {
  // Template hover state for enhanced preview
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => onSelect(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            {/* Template thumbnail */}
            <div className="aspect-[4/3] bg-muted relative">
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Preview button on hover */}
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onPreview(template);
                    }}
                  >
                    Preview Template
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              <div className="flex gap-2 mt-3">
                {template.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Template preview modal */}
      {/* Implement modal component to show full template preview */}
    </div>
  );
}