'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/providers/chat-provider';
import { Message } from '@/components/chat/message';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChatMessages() {
  const { currentChat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure all content is rendered
      // This helps with images and other dynamic content
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentChat?.messages]);
  
  // Empty state when no chat is selected
  if (!currentChat) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400 dark:text-white/40" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-white mb-2">No Conversation Selected</h3>
          <p className="text-gray-500 dark:text-white/60 mb-6">
            Select an existing conversation from the sidebar or start a new one to begin chatting.
          </p>
        </div>
      </div>
    );
  }
  
  // Empty state when chat has no messages
  if (currentChat.messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-sketchdojo-primary/10 to-sketchdojo-accent/10 rounded-full flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-sketchdojo-primary" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-white mb-2">Start a Conversation</h3>
          <p className="text-gray-500 dark:text-white/60 mb-6">
            Begin your creative journey by typing a message below. Describe your manga ideas or ask questions to get started.
          </p>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-sm hover:shadow-md hover:shadow-sketchdojo-primary/20"
            onClick={() => {
              // Scroll to input
              const inputElement = document.querySelector('textarea');
              if (inputElement) {
                inputElement.focus();
              }
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Start Messaging
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col p-3 sm:p-6 gap-3 h-full overflow-auto custom-scrollbar"
    >
      {/* Welcome message */}
      {currentChat.messages.length > 0 && (
        <div className="flex justify-center mb-4">
          <div className="text-center text-xs text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
            Conversation started on {new Date(currentChat.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
      
      {/* Message list */}
      <AnimatePresence mode="sync">
        {currentChat.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: Math.min(index * 0.05, 0.3), // Cap the delay at 0.3s
            }}
          >
            <Message message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-2 p-2 px-4 rounded-lg max-w-[80%] w-fit",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10",
            "text-gray-500 dark:text-white/60 shadow-sm ml-12"
          )}
        >
          <div className="animate-pulse flex space-x-1">
            <div className="h-2 w-2 bg-sketchdojo-primary rounded-full"></div>
            <div className="h-2 w-2 bg-sketchdojo-primary/70 rounded-full delay-75"></div>
            <div className="h-2 w-2 bg-sketchdojo-primary/40 rounded-full delay-150"></div>
          </div>
          <span className="text-sm">Generating response...</span>
        </motion.div>
      )}
      
      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} className="h-px" />
      
      {/* Add some padding at the bottom for better spacing */}
      <div className="h-4" />
      
      {/* Global style for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        
        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}