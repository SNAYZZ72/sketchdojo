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
    // Create a new chat directly instead of redirecting back to the main chat page
    // This prevents the circular redirect that causes build issues
    const redirectTimeout = setTimeout(() => {
      // Redirect to a specific chat ID or handle new chat creation here
      // For now, we'll just stay on this page until proper implementation
      // This breaks the redirect loop between /studio/chat/ and /studio/chat/new
    }, 500);
    
    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return <ChatLoadingState message="Setting up your new manga workspace..." />;
}