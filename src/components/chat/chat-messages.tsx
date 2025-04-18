'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@/providers/chat-provider';
import { Message } from '@/components/chat/message';

export function ChatMessages() {
  const { currentChat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  if (!currentChat) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-white/50 text-center">No chat selected</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 gap-3">
      {currentChat.messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-white/50 text-center">
            Start the conversation by sending a message
          </div>
        </div>
      ) : (
        <>
          {currentChat.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-white/50 p-2">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
              </div>
              <span className="text-sm">Generating...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
} 