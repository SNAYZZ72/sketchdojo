'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/studio/chat/new');
  }, [router]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sketchdojo-primary animate-pulse mr-3"></div>
        <div className="text-xl font-medium">Redirecting to Chat...</div>
      </div>
    </div>
  );
}