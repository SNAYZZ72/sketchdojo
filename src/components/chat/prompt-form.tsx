'use client';

import { useChat } from '@/providers/chat-provider';
import { ChatInputCompact } from './chat-input-compact';

export function PromptForm() {
  const { generateResponse, isLoading } = useChat();

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
    await generateResponse(content);

  };

  return (
    <ChatInputCompact
      onSubmit={handleSubmit}
      isLoading={isLoading}
      placeholder="Describe what happens next..."
    />
  );
} 