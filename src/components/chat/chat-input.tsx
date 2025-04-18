'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Paperclip, MicIcon, PlusCircle, Image, SmileIcon } from 'lucide-react';
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

interface ChatInputProps {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  onAttach?: () => void;
}

export function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Type a message...',
  className,
  onAttach
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Update character count when input changes
  useEffect(() => {
    setCharCount(input.length);
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

  return (
    <div className={cn(
      'border-t border-gray-200 dark:border-white/10 p-3 sm:p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm', 
      className
    )}>
      <div className={cn(
        "relative flex flex-col rounded-xl border transition-all shadow-sm",
        isFocused 
          ? "border-sketchdojo-primary/50 dark:border-sketchdojo-primary/50 shadow-sketchdojo-primary/10" 
          : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20",
        "bg-white dark:bg-black/30"
      )}>
        {/* Main input area */}
        <div className="flex items-end min-h-[56px]">
          <TextareaAutosize
            ref={textareaRef}
            placeholder={placeholder}
            className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent py-3 pl-4 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxRows={6}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {/* Send button */}
          <div className="pr-3 pb-3 flex-shrink-0">
            <AnimatePresence mode="wait">
              {input.trim().length > 0 ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  key="send-button"
                >
                  <Button 
                    size="icon" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={cn(
                      "h-9 w-9 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-md hover:shadow-lg hover:shadow-sketchdojo-primary/20 transition-all",
                      isLoading && "opacity-70"
                    )}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  key="mic-button"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-9 w-9 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          <MicIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Record voice message</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Bottom action bar */}
        <div className="px-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Attachment button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={onAttach}
                    className="h-8 w-8 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Image button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Send image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Emoji button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add emoji</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Character count and info */}
          <div className="flex items-center">
            {input.trim().length > 0 && (
              <span className={cn(
                "text-xs",
                charCount > 500 ? "text-amber-500 dark:text-amber-400" : "text-gray-400 dark:text-white/40"
              )}>
                {charCount} characters
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500 dark:text-white/40 text-center">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
}