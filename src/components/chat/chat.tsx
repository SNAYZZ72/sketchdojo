'use client';

import React, { useCallback, useState } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { ChatMessage } from '@/providers/chat-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
  className?: string;
  onAttach?: () => void;
}

export function Chat({
  messages,
  isLoading = false,
  onSendMessage,
  className,
  onAttach
}: ChatProps) {
  const [isAttaching, setIsAttaching] = useState(false);
  
  const handleSubmit = useCallback((content: string) => {
    onSendMessage(content);
  }, [onSendMessage]);
  
  const handleAttachment = useCallback(() => {
    if (onAttach) {
      setIsAttaching(true);
      // Simulate attachment process completion
      setTimeout(() => {
        setIsAttaching(false);
        onAttach();
      }, 500);
    }
  }, [onAttach]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex h-full flex-col bg-gray-50 dark:bg-gray-900/30', 
        className
      )}
    >
      {/* Attachment indicator - shown when attaching files */}
      {isAttaching && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-t-transparent border-sketchdojo-primary dark:border-sketchdojo-accent rounded-full animate-spin"></div>
            <span className="text-gray-700 dark:text-white/90">Processing attachment...</span>
          </div>
        </div>
      )}
      
      {/* Message list container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Chat input area */}
      <div className="relative z-10">
        <ChatInput 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          placeholder="Type a message..."
          onAttach={onAttach ? handleAttachment : undefined}
        />
      </div>
    </motion.div>
  );
}