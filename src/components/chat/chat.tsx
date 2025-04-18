'use client';

import React, { useCallback } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { ChatMessage } from '@/providers/chat-provider';
import { cn } from '@/lib/utils';

interface ChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
  className?: string;
}

export function Chat({
  messages,
  isLoading = false,
  onSendMessage,
  className
}: ChatProps) {
  const handleSubmit = useCallback((content: string) => {
    onSendMessage(content);
  }, [onSendMessage]);

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
} 