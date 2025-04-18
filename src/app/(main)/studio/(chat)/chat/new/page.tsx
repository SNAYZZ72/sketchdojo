'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';

/**
 * New Chat Page
 * This is a dedicated route for initiating a new chat,
 * it redirects to the main chat page
 */
export default function NewChatPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Simple redirect to the chat landing page
    const redirectTimeout = setTimeout(() => {
      router.push('/studio/chat/');
    }, 500);
    
    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return <ChatLoadingState message="Setting up your new manga workspace..." />;
}