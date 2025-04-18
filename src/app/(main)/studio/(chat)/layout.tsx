import React from 'react';
import { ChatSidebar } from '@/components/chat/chat-sidebar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-sketchdojo-bg">
      {/* Chat sidebar */}
      <ChatSidebar />
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
