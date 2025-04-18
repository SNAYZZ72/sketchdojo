'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAutoRedirectFromPrompt = (
  createChat: (title: string) => any, 
  generateResponse: (prompt: string) => Promise<string | null>,
  generateResponseWithNewChat?: (prompt: string) => Promise<string | null>
) => {
  const router = useRouter();

  useEffect(() => {
    // Create a function to check for the prompt
    const checkForPrompt = async () => {
      // Check if there's an initial prompt stored in localStorage
      const initialPrompt = localStorage.getItem('initial_prompt');
      
      if (initialPrompt) {
        console.log("Found initial prompt in auto-redirect hook, processing...");
        
        try {
          // Always use generateResponseWithNewChat if available to ensure a fresh chat
          if (generateResponseWithNewChat) {
            // Clear the prompt from localStorage before processing to prevent duplicates
            localStorage.removeItem('initial_prompt');
            console.log("Cleared initial_prompt from localStorage");
            
            // Generate the response with a new chat
            console.log("Using generateResponseWithNewChat for:", initialPrompt.slice(0, 30), "...");
            const chatId = await generateResponseWithNewChat(initialPrompt);
            
            if (chatId) {
              // Wait a brief moment to ensure state updates complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Redirect to the specific chat page
              console.log("Generated manga in hook with new chat, redirecting to:", chatId);
              router.push(`/studio/chat/${chatId}`);
              return;
            } else {
              console.error("Failed to generate response with new chat");
            }
          } else {
            // Clear the prompt from localStorage before processing to prevent duplicates
            localStorage.removeItem('initial_prompt');
            console.log("Cleared initial_prompt from localStorage");
            
            // Fallback to original approach
            console.log("Using fallback approach for prompt");
            const newChat = createChat(initialPrompt.slice(0, 30));
            
            // Generate the response
            const chatId = await generateResponse(initialPrompt);
            
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
          localStorage.removeItem('initial_prompt');
          
          // Create a new chat and redirect as fallback
          const newChat = createChat(initialPrompt.slice(0, 30));
          console.log("Created fallback chat with ID:", newChat.id);
          router.push(`/studio/chat/${newChat.id}`);
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