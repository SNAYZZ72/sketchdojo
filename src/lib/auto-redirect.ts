'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storageService, STORAGE_KEYS } from './storage-service';

export const useAutoRedirectFromPrompt = (
  createChat: (title: string) => any, 
  generateResponse: (prompt: string) => Promise<string | null>,
  generateResponseWithNewChat?: (prompt: string) => Promise<string | null>
) => {
  const router = useRouter();

  useEffect(() => {
    // Create a function to check for the prompt
    const checkForPrompt = async () => {
      // Check if there's an initial prompt stored using storageService
      const initialPrompt = storageService.getItem<string>(STORAGE_KEYS.INITIAL_PROMPT, false);
      
      if (initialPrompt) {
        console.log("Found initial prompt in auto-redirect hook, processing...");
        
        try {
          // Clear the prompt from storage before processing to prevent duplicates
          storageService.removeItem(STORAGE_KEYS.INITIAL_PROMPT);
          console.log("Cleared initial_prompt from storage");
          
          // Always use generateResponseWithNewChat if available to ensure a fresh chat
          if (generateResponseWithNewChat) {
            // Generate the response with a new chat
            console.log("Using generateResponseWithNewChat for:", 
              typeof initialPrompt === 'string' ? initialPrompt.slice(0, 30) : 'Invalid prompt', "...");
            const chatId = await generateResponseWithNewChat(initialPrompt as string);
            
            if (chatId) {
              // Wait a brief moment to ensure state updates complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Redirect to the specific chat page
              console.log("Generated manga in hook with new chat, redirecting to:", chatId);
              router.push(`/studio/chat/${chatId}`);
              return;
            }
          } else {
            // Fallback to original approach
            console.log("Using fallback approach for prompt");
            const promptString = initialPrompt as string;
            const newChat = createChat(promptString.slice(0, 30));
            
            // Generate the response
            const chatId = await generateResponse(promptString);
            
            if (chatId) {
              // Wait a brief moment to ensure state updates complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Redirect to the specific chat page
              console.log("Generated manga in hook, redirecting to:", chatId);
              router.push(`/studio/chat/${chatId}`);
              return;
            } else {
              // If generation failed, still redirect to the chat
              console.log("Error during generation in hook, redirecting to:", newChat.id);
              router.push(`/studio/chat/${newChat.id}`);
              return;
            }
          }
        } catch (error) {
          console.error("Error processing prompt in auto-redirect hook:", error);
          
          // Ensure prompt is cleared even on error
          storageService.removeItem(STORAGE_KEYS.INITIAL_PROMPT);
          
          // If everything fails, redirect home to try again
          router.push('/');
          return;
        }
      }
    };
    
    // Initial check for prompt
    checkForPrompt();
    
    // Set up a small delay to check again for the prompt
    // (helps with timing issues where localStorage isn't set immediately)
    const checkAgainTimeout = setTimeout(() => {
      checkForPrompt();
    }, 500);
    
    return () => {
      clearTimeout(checkAgainTimeout);
    };
  }, [createChat, generateResponse, generateResponseWithNewChat, router]);
};