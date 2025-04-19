'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';
import { storageService, STORAGE_KEYS } from '@/lib/storage-service';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';

/**
 * Chat Landing Page
 * Handles initial prompts and redirects to specific chat pages
 * or redirects users back to the main site to create new chats
 */
export default function ChatLandingPage() {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProcess = searchParams.get('directProcess') === 'true';
  
  // Chat context
  const { 
    createChat, 
    generateResponseWithNewChat, 
    reloadChatsFromStorage 
  } = useChat();
  
  // Process a prompt stored in localStorage
  const processStoredPrompt = useCallback(async (prompt: string) => {
    try {
      // Clear storage to prevent duplicates
      storageService.removeItem(STORAGE_KEYS.INITIAL_PROMPT);
      
      // Always create a new chat for stored prompts
      console.log('Processing stored prompt, generating manga...');
      const chatId = await generateResponseWithNewChat(prompt);
      
      if (chatId) {
        // Success - redirect to the new chat with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/studio/chat/${chatId}`);
      } else {
        // API error - create a chat without AI generation
        const newChat = createChat(prompt);
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/studio/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error("Error processing stored prompt:", error);
      
      // Redirect to the home page on error
      router.push('/site');
    }
  }, [createChat, generateResponseWithNewChat, router]);
  
  // Check for initial prompt on mount and handle redirects
  useEffect(() => {
    // Force reload from localStorage to ensure we have the latest chats
    reloadChatsFromStorage();
    
    // Check for an initial prompt from storage
    const checkInitialPrompt = async () => {
      try {
        const initialPrompt = storageService.getItem<string>(STORAGE_KEYS.INITIAL_PROMPT, false);
        
        if (initialPrompt) {
          // We have a prompt in storage - process it
          await processStoredPrompt(initialPrompt as string);
        } else {
          // If no prompt is present and directProcess was specified, redirect to the site
          if (directProcess) {
            router.push('/site');
          }
        }
      } catch (error) {
        console.error("Error checking initial prompt:", error);
        router.push('/site');
      }
    };
    
    checkInitialPrompt();
  }, [directProcess, reloadChatsFromStorage, processStoredPrompt, router]);
  
  // Show loading state if a direct process was requested
  if (directProcess) {
    return <ChatLoadingState message="Preparing your manga experience..." />;
  }
  
  // Main UI - Redirect message to the main site
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl text-center">
        <div className="mb-6 w-16 h-16 mx-auto bg-purple-600/20 rounded-full flex items-center justify-center">
          <ArrowLeft className="h-8 w-8 text-purple-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Start from Home
        </h1>
        
        <p className="text-white/70 mb-8">
          To create a new manga project, please return to the main site where you can enter your creative prompt.
        </p>
        
        <Button
          onClick={() => router.push('/site')}
          className="w-full py-2 px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:opacity-90 transition-all duration-300"
        >
          Go to Main Site
        </Button>
      </div>
    </div>
  );
}