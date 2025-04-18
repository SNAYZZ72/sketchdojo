'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';

/**
 * Simple redirect page for /studio/(chat)
 * Redirects users to the chat interface or home page based on their chat history
 */
export default function StudioChatRedirect() {
  const router = useRouter();
  const { chats, isLoading } = useChat();
  
  useEffect(() => {
    // Don't redirect until chat data is loaded
    if (isLoading) return;
    
    // Simple redirect logic with a short delay to avoid flickering
    const redirectTimeout = setTimeout(() => {
      if (chats.length > 0) {
        // If they have chats, redirect to their most recent chat
        const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
        router.push(`/studio/chat/${sortedChats[0].id}`);
      } else {
        // If they don't have any chats, redirect to main chat landing page
        router.push('/studio/chat/new');
      }
    }, 500);
    
    return () => clearTimeout(redirectTimeout);
  }, [chats, router, isLoading]);

  return <ChatLoadingState message="Redirecting to your manga workspace..." />;
}