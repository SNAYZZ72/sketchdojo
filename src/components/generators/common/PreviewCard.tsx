import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Undo2, 
  ChevronRight, 
  RefreshCw, 
  Copy,
  Loader2,
  Wand2,
  ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportDropdown from './ExportDropdown';
import SaveDialog from './SaveDialog';

interface ExportOption {
  value: string;
  label: string;
}

interface Project {
  id: string;
  title: string;
}

interface FormState {
  name: string;
  description: string;
  projectId: string | null;
}

interface PreviewCardProps {
  type: 'character' | 'background';
  generationHistory: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
  onVariation: () => Promise<void>;
  exportOptions: ExportOption[];
  onExport: (format: string) => void;
  generationParams: {
    width: number;
    height: number;
  };
  formState: FormState;
  setFormState: (state: FormState | ((prev: FormState) => FormState)) => void;
  isSaving: boolean;
  onSave: () => Promise<void>;
  projects: Project[];
  className?: string;
  imageClassName?: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  type,
  generationHistory,
  currentImageIndex,
  setCurrentImageIndex,
  isGenerating,
  onGenerate,
  onVariation,
  exportOptions,
  onExport,
  generationParams,
  formState,
  setFormState,
  isSaving,
  onSave,
  projects,
  className,
  imageClassName
}) => {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-md overflow-hidden",
        className
      )}
    >
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-gray-900 dark:text-white">
            {type === 'character' ? 'Character' : 'Background'} Preview
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {generationHistory.length > 1 && (
              <div className="flex items-center mr-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex <= 0}
                  className="text-gray-700 border-gray-300 dark:text-white dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <span className="mx-2 text-sm text-gray-700 dark:text-white">
                  {currentImageIndex + 1}/{generationHistory.length}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCurrentImageIndex(Math.min(generationHistory.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex >= generationHistory.length - 1}
                  className="text-gray-700 border-gray-300 dark:text-white dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <ExportDropdown 
              options={exportOptions}
              onExport={onExport}
              disabled={generationHistory.length === 0}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-center items-center">
          <div className={cn(
            "relative overflow-hidden bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-lg",
            type === 'character' ? "aspect-[3/4] w-full max-w-md" : "w-full max-w-4xl aspect-video",
            imageClassName
          )}>
            {generationHistory.length > 0 && currentImageIndex >= 0 ? (
              <div className="relative w-full h-full">
                <img 
                  src={generationHistory[currentImageIndex]} 
                  alt={`Generated ${type}`} 
                  className="w-full h-full object-contain" 
                  width={generationParams.width}
                  height={generationParams.height}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse"></div>
                  <ImageIcon className="h-16 w-16 text-gray-400 dark:text-white/20 mb-4 relative z-10" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No {type === 'character' ? 'Character' : 'Background'} Generated Yet</h3>
                <p className="text-sm text-gray-600 dark:text-white/60 mb-6 max-w-sm">
                  Configure your {type.toLowerCase()} attributes and click "Generate {type === 'character' ? 'Character' : 'Background'}" to see a preview.
                </p>
                <Button 
                  onClick={onGenerate} 
                  disabled={isGenerating}
                  variant="outline"
                  className="gap-2 text-gray-700 dark:text-white border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Now
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {generationHistory.length > 0 && (
        <CardFooter className="flex flex-col gap-4 px-6 pt-0 pb-6">
          <SaveDialog 
            contentType={type}
            formState={formState}
            setFormState={setFormState}
            isSaving={isSaving}
            onSave={onSave}
            projects={projects}
            buttonVariant="secondary"
            buttonClassName="w-full gap-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          />
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1 text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 gap-2" 
              onClick={onGenerate} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 gap-2" 
              disabled={isGenerating}
              onClick={onVariation}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Variations
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PreviewCard;