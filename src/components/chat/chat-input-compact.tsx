'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Sparkles, LockKeyhole, Globe, MicIcon, Image, SmileIcon } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface ChatInputCompactProps {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  onEnhance?: (value: string) => void;
  onAttach?: () => void;
  isPublic?: boolean;
  onTogglePublic?: (value: boolean) => void;
}

export function ChatInputCompact({
  onSubmit,
  isLoading = false,
  placeholder = 'Describe your manga idea...',
  className,
  onEnhance,
  onAttach,
  isPublic = true,
  onTogglePublic
}: ChatInputCompactProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  // Update character count when input changes
  React.useEffect(() => {
    setCharacterCount(input.length);
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim().length === 0 || isLoading) return;
    
    onSubmit(input);
    setInput('');
  };

  const handleEnhance = async () => {
    if (input.trim().length === 0 || !onEnhance || isLoading || isEnhancing) return;
    
    try {
      setIsEnhancing(true);
      await onEnhance(input);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden transition-all shadow-md",
      isFocused 
        ? "border-2 border-sketchdojo-primary/50" 
        : "border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20",
      "bg-white dark:bg-gray-900/90 backdrop-blur-md",
      className
    )}>
      {/* Main textarea */}
      <TextareaAutosize
        ref={textareaRef}
        placeholder={placeholder}
        className="w-full min-h-[72px] bg-transparent p-4 text-gray-900 dark:text-white focus:outline-none resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-white/40"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        maxRows={8}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {/* Action bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-y-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40">
        {/* Left side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Attach button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAttach}
                  disabled={isLoading}
                  className="h-8 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md"
                >
                  <Paperclip className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Attach</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Upload a reference image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Enhance button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleEnhance}
                  disabled={!input.trim() || !onEnhance || isLoading || isEnhancing}
                  className={cn(
                    "h-8 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md",
                    (!input.trim() || !onEnhance || isLoading || isEnhancing) 
                      ? "text-gray-400 dark:text-white/30 opacity-60" 
                      : "text-gray-600 dark:text-white/70"
                  )}
                >
                  {isEnhancing ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-sketchdojo-primary dark:border-sketchdojo-accent rounded-full animate-spin mr-1.5"></div>
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1.5" />
                  )}
                  <span className="text-xs">{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Enhance your prompt with AI</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Character count */}
          {input.trim().length > 0 && (
            <span className={cn(
              "text-xs hidden sm:inline",
              characterCount > 500 ? "text-amber-500 dark:text-amber-400" : "text-gray-400 dark:text-white/40"
            )}>
              {characterCount} chars
            </span>
          )}
          
          {/* Public/Private toggle */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePublic?.(!isPublic)}
                      disabled={isLoading}
                      className="p-0 h-auto bg-transparent border-none hover:bg-transparent"
                    >
                      <div className="flex items-center gap-1.5">
                        {isPublic ? (
                          <Globe className="h-4 w-4 text-sketchdojo-primary" />
                        ) : (
                          <LockKeyhole className="h-4 w-4 text-gray-500 dark:text-white/60" />
                        )}
                        <span className="text-xs text-gray-500 dark:text-white/60 hidden sm:inline">
                          {isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isPublic ? 'Make your conversation private' : 'Make your conversation public'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={isPublic}
              onCheckedChange={onTogglePublic}
              disabled={isLoading}
              className={cn(
                "data-[state=checked]:bg-sketchdojo-primary", 
                isLoading && "opacity-50"
              )}
            />
          </div>
          
          {/* Send button */}
          <AnimatePresence mode="wait">
            <Button 
              onClick={handleSubmit}
              disabled={input.trim().length === 0 || isLoading}
              size="sm"
              className={cn(
                "rounded-full px-4 h-9 shadow-md transition-all",
                input.trim().length === 0 || isLoading
                  ? "bg-sketchdojo-primary/50 dark:bg-sketchdojo-primary/30 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:shadow-lg hover:shadow-sketchdojo-primary/20"
              )}
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  <span>Processing</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  className="flex items-center"
                >
                  <span className="mr-1.5">Send</span>
                  <Send className="h-3.5 w-3.5" />
                </motion.div>
              )}
            </Button>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Additional action bar for extra features */}
      <div className="hidden sm:flex px-4 py-1.5 items-center justify-between border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
        <div className="flex items-center gap-1.5">
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="h-3.5 w-3.5" />
          </Button>
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <SmileIcon className="h-3.5 w-3.5" />
          </Button>
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <MicIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 dark:text-white/40">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </div>
    </div>
  );
}