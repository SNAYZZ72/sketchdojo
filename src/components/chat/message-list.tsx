'use client';

import React, { useEffect, useRef } from 'react';
import { Message, LoadingMessage } from '@/components/chat/message';
import { ChatMessage } from '@/providers/chat-provider';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change or when loading state changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-white/50">
            Start a conversation by typing a message below.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingMessage />}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
} 