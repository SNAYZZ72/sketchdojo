'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';

export default function StudioChatRedirect() {
  const router = useRouter();
  const { chats } = useChat();
  
  // Redirect logic based on user's chat history
  useEffect(() => {
    // Check if user has any existing chats
    if (chats.length > 0) {
      // If they have chats, redirect to their most recent chat
      const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
      router.push(`/studio/chat/${sortedChats[0].id}`);
    } else {
      // If they don't have any chats, redirect to home page to create first prompt
      router.push('/');
    }
  }, [chats, router]);

  // Simple loading state while redirecting
  return (
    <div className="min-h-screen bg-sketchdojo-bg flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sketchdojo-primary/30 border-t-sketchdojo-primary rounded-full animate-spin"></div>
        <p className="text-white">Loading your manga experience...</p>
      </div>
    </div>
  );
}