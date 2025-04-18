'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Sparkles, LockKeyhole, Globe } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const handleEnhance = () => {
    if (input.trim().length === 0 || !onEnhance) return;
    onEnhance(input);
  };

  return (
    <div className={cn(
      "bg-black/60 rounded-xl overflow-hidden transition-all",
      isFocused ? "border-2 border-purple-500/50" : "border border-white/10",
      className
    )}>
      <TextareaAutosize
        ref={textareaRef}
        placeholder={placeholder}
        className="w-full min-h-[60px] bg-transparent p-4 text-white focus:outline-none resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        maxRows={6}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      <div className="px-4 py-3 flex items-center justify-between border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onAttach}
            className="text-white/60 hover:text-white/90 flex items-center gap-1.5 transition-colors text-xs hover:bg-white/5 p-1.5 px-2 rounded-md"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
            <span>Attach</span>
          </button>
          <button 
            type="button"
            onClick={handleEnhance}
            disabled={!input.trim() || !onEnhance || isLoading}
            className="text-white/60 hover:text-white/90 flex items-center gap-1.5 transition-colors text-xs disabled:opacity-50 disabled:pointer-events-none hover:bg-white/5 p-1.5 px-2 rounded-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Enhance</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTogglePublic?.(!isPublic)}
              className="flex items-center gap-1.5 p-1.5 px-2 rounded-md hover:bg-white/5 transition-colors"
              disabled={isLoading}
            >
              {isPublic ? (
                <Globe className="h-4 w-4 text-purple-400" />
              ) : (
                <LockKeyhole className="h-4 w-4 text-white/60" />
              )}
              <span className="text-xs text-white/60">
                {isPublic ? 'Public' : 'Private'}
              </span>
            </button>
            <div 
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors", 
                isPublic ? "bg-purple-600" : "bg-gray-600"
              )}
              onClick={() => !isLoading && onTogglePublic?.(!isPublic)}
            >
              <div className={cn(
                "absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all shadow-md",
                isPublic ? "right-[2px]" : "left-[2px]"
              )}></div>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={input.trim().length === 0 || isLoading}
            size="sm"
            className={cn(
              "text-white rounded-full px-4 h-9 shadow-lg transition-all",
              input.trim().length === 0 || isLoading
                ? "bg-purple-600/50 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
            )}
          >
            {isLoading ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                <span>Processing</span>
              </>
            ) : (
              <>
                <span className="mr-2">Send</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 