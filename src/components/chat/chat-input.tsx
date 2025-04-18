'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { SendIcon } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Type a message...',
  className
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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
    <div className={cn('border-t border-white/10 p-4', className)}>
      <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
        <TextareaAutosize
          ref={textareaRef}
          placeholder={placeholder}
          className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent p-2 text-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxRows={6}
        />
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleSubmit}
          disabled={input.trim().length === 0 || isLoading}
          className="h-8 w-8 rounded-md hover:bg-white/10"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-white/50 text-center">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
} 