'use client';

import { useState } from 'react';
import { useChat } from '@/providers/chat-provider';
import { ChatInputCompact } from './chat-input-compact';

export function PromptForm() {
  const { generateResponse, isLoading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
    await generateResponse(content);
    setInput('');
  };

  return (
    <ChatInputCompact
      onSubmit={handleSubmit}
      isLoading={isLoading}
      placeholder="Describe what happens next..."
    />
  );
} 