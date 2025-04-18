'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { storageService, STORAGE_KEYS } from '@/lib/storage-service';

export default function StudioChatRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProcess = searchParams.get('directProcess') === 'true';
  const { currentChat, chats, createChat, generateResponse, generateResponseWithNewChat, reloadChatsFromStorage } = useChat();
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [processingPrompt, setProcessingPrompt] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading your manga experience...');
  
  // Log on component mount for debugging
  useEffect(() => {
    console.log("StudioChatRedirect: Component mounted");
    console.log("StudioChatRedirect: directProcess =", directProcess);
    console.log("StudioChatRedirect: currentChat =", currentChat?.id);
    console.log("StudioChatRedirect: total chats =", chats.length);
    
    // Force reload from localStorage to ensure we have the latest chats
    reloadChatsFromStorage();
  }, [directProcess, currentChat, chats.length, reloadChatsFromStorage]);
  
  // First check for an initial prompt and process it,
  // or redirect to the most recent chat if one exists
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check if there's an initial prompt stored in storage service
        const initialPrompt = storageService.getItem<string>(STORAGE_KEYS.INITIAL_PROMPT, false);
        console.log("StudioChatRedirect: initialPrompt from storage =", initialPrompt ? (initialPrompt as string).slice(0, 30) + "..." : "null");
        
        if (initialPrompt) {
          console.log("StudioChatRedirect: Found initial prompt, processing...");
          setStatusMessage('Creating your manga...');
          setProcessingPrompt(true);
          
          // Clear it from storage before processing to prevent duplicates
          storageService.removeItem(STORAGE_KEYS.INITIAL_PROMPT);
          console.log("StudioChatRedirect: Cleared initial_prompt from storage");
          
          // If directProcess is true, we want to immediately generate and redirect
          if (directProcess) {
            console.log("StudioChatRedirect: directProcess=true, will create new chat");
            setStatusMessage('Generating your manga...');
            
            try {
              // ALWAYS create a new chat for each prompt using our special function
              console.log("StudioChatRedirect: Direct processing enabled, creating new chat...");
              const chatId = await generateResponseWithNewChat(initialPrompt as string);
              console.log("StudioChatRedirect: generateResponseWithNewChat returned chatId:", chatId);
              
              if (chatId) {
                // Allow a short delay for state updates to complete
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Redirect to the specific chat page with the ID
                console.log("StudioChatRedirect: Generated manga, redirecting to:", chatId);
                router.push(`/studio/chat/${chatId}`);
                return; // Exit early
              } else {
                // Fallback if generation fails - create a new chat
                console.log("StudioChatRedirect: Error during generation, falling back to createChat");
                const newChat = createChat(initialPrompt as string);
                console.log("StudioChatRedirect: Created fallback chat with ID:", newChat.id);
                
                // Allow a short delay for state updates to complete
                await new Promise(resolve => setTimeout(resolve, 100));
                
                router.push(`/studio/chat/${newChat.id}`);
                return; // Exit early
              }
            } catch (error) {
              console.error("StudioChatRedirect: Error processing prompt for direct redirect:", error);
              // Create a new chat and redirect even if there's an error
              const newChat = createChat(initialPrompt as string);
              console.log("StudioChatRedirect: Created error fallback chat with ID:", newChat.id);
              
              // Allow a short delay for state updates to complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              router.push(`/studio/chat/${newChat.id}`);
              return; // Exit early
            }
          } else {
            console.log("StudioChatRedirect: directProcess=false, processing normally");
          }
          
          // If not direct processing, continue with normal flow but still use the new function
          setStatusMessage('Generating your manga...');
          console.log("StudioChatRedirect: Generating response with new chat for prompt:", (initialPrompt as string).slice(0, 30));
          const chatId = await generateResponseWithNewChat(initialPrompt as string);
          
          if (chatId) {
            // Allow a short delay for state updates to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect to the specific chat page
            console.log("StudioChatRedirect: Generated manga, redirecting to:", chatId);
            router.push(`/studio/chat/${chatId}`);
          } else {
            // If generation failed, still create a new chat and redirect
            console.log("StudioChatRedirect: Error during generation");
            const newChat = createChat(initialPrompt as string);
            console.log("StudioChatRedirect: Created fallback chat with ID:", newChat.id);
            
            // Allow a short delay for state updates to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            
            router.push(`/studio/chat/${newChat.id}`);
          }
        } 
        // If no prompt, show the first-time experience (do NOT redirect or create a chat)
        else {
          console.log("StudioChatRedirect: No initial prompt, showing first-time experience");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("StudioChatRedirect: Error initializing chat:", error);
        setStatusMessage('Error creating manga. Please try again.');
        setIsLoading(false);
        setProcessingPrompt(false);
      }
    };
    
    initializeChat();
  }, [chats, router, createChat, generateResponse, generateResponseWithNewChat, directProcess]);
  
  // Handle creation of a new chat
  const handleCreateManga = async () => {
    if (!promptInput.trim()) return;
    
    setProcessingPrompt(true);
    setStatusMessage('Creating your manga...');
    
    try {
      // Always use the new function to generate with a new chat
      setStatusMessage('Generating your manga...');
      console.log("StudioChatRedirect: Handling user input to create new manga with prompt:", promptInput.slice(0, 30));
      const chatId = await generateResponseWithNewChat(promptInput);
      
      if (chatId) {
        // Allow a short delay for state updates to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect to the specific chat page with the returned chat ID
        console.log("StudioChatRedirect: Generated manga from user input, redirecting to:", chatId);
        router.push(`/studio/chat/${chatId}`);
      } else {
        // If generation failed, still create a new chat and redirect
        console.log("StudioChatRedirect: Error during generation from user input");
        const newChat = createChat(promptInput);
        console.log("StudioChatRedirect: Created fallback chat from user input with ID:", newChat.id);
        
        // Allow a short delay for state updates to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        router.push(`/studio/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error("StudioChatRedirect: Error creating manga from user input:", error);
      setStatusMessage('Error creating manga. Please try again.');
      setProcessingPrompt(false);
    }
  };
  
  // If we're loading or processing a prompt, show a loading state
  if (isLoading || processingPrompt) {
    return (
      <div className="min-h-screen bg-sketchdojo-bg flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sketchdojo-primary/30 border-t-sketchdojo-primary rounded-full animate-spin"></div>
          <p className="text-white">{statusMessage}</p>
        </div>
      </div>
    );
  }
  
  // First-time experience UI for users with no chats
  return (
    <div className="min-h-screen bg-sketchdojo-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Welcome to SketchDojo
          </h1>
          <p className="text-white/70 text-base md:text-lg">
            Let&apos;s create your first manga! Start by describing your idea below.
          </p>
        </div>
        
        <div className="mb-6">
          <TextareaAutosize
            placeholder="Describe your manga idea... (e.g., 'A young ninja in a cyberpunk city, fighting against corrupt AI overlords')"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full min-h-[120px] p-4 rounded-xl bg-white/5 border border-white/20 text-white resize-none focus:ring-1 focus:ring-sketchdojo-primary/50 focus:border-sketchdojo-primary/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleCreateManga();
              }
            }}
          />
          <p className="text-xs text-white/50 mt-2">Press Ctrl+Enter to submit</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleCreateManga}
            disabled={!promptInput.trim() || processingPrompt}
            className="py-2 px-6 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-primary/80 text-white hover:brightness-110 transition-all duration-300 flex items-center gap-2"
          >
            {processingPrompt ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Create Your Manga</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-medium text-white mb-2">🌟 Be Descriptive</h3>
            <p className="text-sm text-white/70">Add details about characters, settings, emotions, and action.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-medium text-white mb-2">🎭 Define Style</h3>
            <p className="text-sm text-white/70">Specify the manga style you prefer (shounen, shoujo, seinen, etc.)</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-medium text-white mb-2">✨ Add Atmosphere</h3>
            <p className="text-sm text-white/70">Mention lighting, mood, time of day, and weather for better scenes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
