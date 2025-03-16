import React, { useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, ClipboardCheck } from 'lucide-react';
import { themeAwareStyles } from './theme-utils';

interface PromptViewerProps {
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  promptText: string;
  negativePrompt: string;
  onNegativePromptChange: (value: string) => void;
  copyPromptToClipboard: () => void;
}

const PromptViewer: React.FC<PromptViewerProps> = ({
  showPrompt,
  setShowPrompt,
  promptText,
  negativePrompt,
  onNegativePromptChange,
  copyPromptToClipboard
}) => {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const negativePromptRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-gray-700 dark:text-white/80">View Prompt</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPrompt(!showPrompt)}
          className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 gap-1"
        >
          {showPrompt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPrompt ? "Hide Prompt" : "Show Prompt"}
        </Button>
      </div>
      
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            className="space-y-4 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt" className="text-gray-700 dark:text-white/80">Generated Prompt</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyPromptToClipboard}
                  className="h-7 text-xs text-gray-600 dark:text-white/80 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10"
                >
                  <ClipboardCheck className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <Textarea 
                id="prompt" 
                ref={promptRef}
                value={promptText}
                className="h-24 resize-none text-xs font-mono border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-800 dark:text-white/80"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="negative-prompt" className="text-gray-700 dark:text-white/80">Negative Prompt</Label>
              <Textarea 
                id="negative-prompt" 
                ref={negativePromptRef}
                value={negativePrompt}
                onChange={(e) => onNegativePromptChange(e.target.value)}
                className="h-16 resize-none text-xs font-mono border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                placeholder="Enter terms to exclude from generation..."
              />
              <p className="text-xs text-gray-600 dark:text-white/60">
                Terms to exclude from the generation (e.g., "bad anatomy, blurry, low quality")
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptViewer;