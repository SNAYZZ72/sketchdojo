'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Message, LoadingMessage } from '@/components/chat/message';
import { ChatMessage } from '@/providers/chat-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (!hasScrolled || messages.length <= 1) {
      scrollToBottom(true);
    } else if (messages.length > 0) {
      // Check if the last message is from the user - if so, scroll to bottom
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        scrollToBottom(true);
      } else {
        // Otherwise, show the scroll button if not at bottom
        checkScrollPosition();
      }
    }
  }, [messages, isLoading, hasScrolled]);

  // Setup scroll event listener to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      checkScrollPosition();
      
      // Set hasScrolled to true once user has manually scrolled
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Check if we're near the bottom to determine whether to show scroll button
  const checkScrollPosition = () => {
    const container = containerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
  };

  // Function to scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      const scrollBehavior = smooth ? 'smooth' : 'auto';
      messagesEndRef.current.scrollIntoView({ 
        behavior: scrollBehavior, 
        block: 'end' 
      });
      
      // Hide the scroll button
      setShowScrollButton(false);
    }
  };

  // Group messages by date for better conversation context
  const getMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Get time from timestamp in 12-hour format
  const getMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Determine if we should show a date separator
  const shouldShowDateSeparator = (message: ChatMessage, index: number) => {
    if (index === 0) return true;
    
    const currentDate = getMessageDate(message.timestamp);
    const prevDate = getMessageDate(messages[index - 1].timestamp);
    
    return currentDate !== prevDate;
  };
  
  // Determine if we should show a time separator (for messages more than 10 minutes apart)
  const shouldShowTimeSeparator = (message: ChatMessage, index: number) => {
    if (index === 0) return false;
    
    const currentTime = message.timestamp;
    const prevTime = messages[index - 1].timestamp;
    const timeDiff = currentTime - prevTime;
    
    // Return true if messages are more than 10 minutes apart
    return timeDiff > 10 * 60 * 1000;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 custom-scrollbar relative"
      aria-live="polite"
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-sm p-6">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-gray-400 dark:text-white/40" />
            </div>
            <h4 className="text-base font-medium text-gray-700 dark:text-white/80 mb-1">
              Start a conversation
            </h4>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Type a message below to begin chatting about your manga ideas
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Welcome message for first message */}
          {messages.length > 0 && (
            <div className="flex justify-center mb-6">
              <div className="text-center text-xs text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                Conversation started
              </div>
            </div>
          )}
          
          {/* Message list with date separators */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                {/* Date separator */}
                {shouldShowDateSeparator(message, index) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center my-4"
                  >
                    <div className="text-xs text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                      {new Date(message.timestamp).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </motion.div>
                )}
                
                {/* Time separator for messages sent more than 10 minutes apart */}
                {shouldShowTimeSeparator(message, index) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center my-2"
                  >
                    <div className="text-xs text-gray-400 dark:text-white/30">
                      {getMessageTime(message.timestamp)}
                    </div>
                  </motion.div>
                )}
                
                {/* Message with animation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.2,
                    // Only delay animation for the last few messages to avoid long waits
                    delay: index > messages.length - 4 ? Math.min((messages.length - index) * 0.05, 0.15) : 0
                  }}
                >
                  <Message message={message} />
                </motion.div>
              </React.Fragment>
            ))}
            
            {/* Loading state */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <LoadingMessage />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-2" />
          
          {/* Add extra space at bottom for better UX */}
          <div className="h-6" />
        </div>
      )}
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 right-6"
          >
            <Button
              size="icon"
              onClick={() => scrollToBottom()}
              className={cn(
                "h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10",
                "text-gray-600 dark:text-white/80 shadow-lg hover:shadow-xl transition-all"
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom scrollbar styles */}
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