'use client';

import { useChat } from '@/providers/chat-provider';
import { ChatInputCompact } from './chat-input-compact';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PromptForm() {
  const { generateResponse, isLoading } = useChat();

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
    await generateResponse(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto px-4 py-3"
    >
      <ChatInputCompact
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="Describe what happens next..."
        className={cn(
          "shadow-lg border-2 hover:border-sketchdojo-primary/70",
          "transition-all duration-300 ease-in-out",
          "bg-white/90 dark:bg-gray-900/80 backdrop-blur-md"
        )}
      />
    </motion.div>
  );
}