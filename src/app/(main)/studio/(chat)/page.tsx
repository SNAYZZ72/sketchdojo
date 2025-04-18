'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';

export default function ChatRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Add a small delay to prevent immediate redirect loop
    const redirectTimeout = setTimeout(() => {
      router.push('/studio/chat/new');
    }, 300);
    
    return () => clearTimeout(redirectTimeout);
  }, [router]);
  
  return <ChatLoadingState message="Setting up your chat workspace..." />;
}