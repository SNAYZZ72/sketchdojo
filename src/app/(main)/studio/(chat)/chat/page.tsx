'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';
import { storageService, STORAGE_KEYS } from '@/lib/storage-service';

// UI Components
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Wand2, Info } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';

// Example prompts for user inspiration
const EXAMPLE_PROMPTS = [
  {
    category: "Popular Styles",
    examples: [
      { id: 1, text: "Shounen Action", prompt: "A teenage hero with supernatural powers facing a powerful villain in an epic battle", icon: "🔥" },
      { id: 2, text: "Romantic Comedy", prompt: "Two high school students who secretly like each other but constantly argue in class", icon: "💕" },
      { id: 3, text: "Dark Fantasy", prompt: "A cursed swordsman in a medieval world hunted by demons that emerge at night", icon: "🌑" },
    ]
  },
  {
    category: "Settings & Scenes",
    examples: [
      { id: 4, text: "Cyberpunk City", prompt: "A neon-lit cyberpunk Tokyo street with flying cars and holographic advertisements", icon: "🏙️" },
      { id: 5, text: "Quiet Moment", prompt: "Two friends sitting on a school rooftop during sunset, cherry blossoms falling around them", icon: "🌸" },
      { id: 6, text: "Epic Battle", prompt: "A climactic showdown between martial artists in a mountain temple during a thunderstorm", icon: "⚔️" },
    ]
  }
];

/**
 * Chat Landing Page
 * Handles initial prompts, first-time user experience, and redirects to specific chat pages
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
  
  // Local state
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading...');
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Check for initial prompt on mount
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
          // No prompt - show UI
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking initial prompt:", error);
        setIsLoading(false);
      }
    };
    
    checkInitialPrompt();
  }, [directProcess, reloadChatsFromStorage]);
  
  // Process a prompt stored in localStorage
  const processStoredPrompt = async (prompt: string) => {
    try {
      setIsProcessing(true);
      setStatusMessage('Creating your manga...');
      
      // Clear storage to prevent duplicates
      storageService.removeItem(STORAGE_KEYS.INITIAL_PROMPT);
      
      // Always create a new chat for stored prompts
      setStatusMessage('Generating your manga...');
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
      setIsProcessing(false);
      setIsLoading(false);
      setStatusMessage('Error creating manga. Please try again.');
    }
  };
  
  // Handle prompt submission from UI
  const handleCreateManga = async () => {
    if (!promptInput.trim() || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setStatusMessage('Generating your manga...');
      
      // Always use dedicated function for new chats
      const chatId = await generateResponseWithNewChat(promptInput);
      
      if (chatId) {
        // Success - redirect to the new chat with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/studio/chat/${chatId}`);
      } else {
        // API error - create a chat without AI generation
        const newChat = createChat(promptInput);
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/studio/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error("Error creating manga:", error);
      setIsProcessing(false);
      setStatusMessage('Error creating manga. Please try again.');
    }
  };
  
  // Handle selecting an example prompt
  const selectExamplePrompt = (prompt: string) => {
    setPromptInput(prompt);
  };
  
  // Handle enhancing a prompt with AI
  const enhancePrompt = async () => {
    if (!promptInput.trim() || isEnhancing) return;
    
    setIsEnhancing(true);
    try {
      // This would connect to an actual AI enhancement service
      // For now, we'll just add some descriptive elements
      const enhancedPrompt = `${promptInput} [Enhanced with dramatic lighting, detailed character expressions, vibrant colors, and dynamic composition]`;
      setPromptInput(enhancedPrompt);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Show loading state
  if (isLoading || isProcessing) {
    return <ChatLoadingState message={statusMessage} />;
  }
  
  // Main UI - First time experience / New prompt page
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Create Your Manga
          </h1>
          <p className="text-white/70 text-base md:text-lg">
            Describe your manga scene or story and our AI will bring it to life
          </p>
        </div>
        
        {/* Prompt Input */}
        <div className="mb-6 relative">
          <div className="relative rounded-xl shadow-lg shadow-purple-500/10 border border-white/20 focus-within:border-purple-500/50 transition-all bg-black/40">
            <TextareaAutosize
              placeholder="Describe your manga idea... (e.g., 'A young ninja in a cyberpunk city, fighting against corrupt AI overlords')"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full min-h-[120px] p-4 bg-transparent text-white resize-none focus:outline-none focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleCreateManga();
                }
              }}
            />
            
            {/* Input Actions Row */}
            <div className="border-t border-white/10 px-3 py-2 flex flex-wrap justify-between items-center gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Regular buttons without tooltips */}
                <button
                  type="button"
                  className="text-white/60 hover:text-white/90 flex items-center gap-1.5 text-xs hover:bg-white/10 p-1.5 px-2 rounded-md transition-colors"
                  title="Upload a reference image"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Upload</span>
                </button>
                
                <button
                  type="button"
                  onClick={enhancePrompt}
                  className="text-white/60 hover:text-white/90 flex items-center gap-1.5 text-xs hover:bg-white/10 p-1.5 px-2 rounded-md transition-colors"
                  disabled={isEnhancing || !promptInput.trim()}
                  title="Enhance your prompt with AI to add more detail"
                >
                  {isEnhancing ? (
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin block"></span>
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span>{isEnhancing ? "Enhancing..." : "Enhance"}</span>
                </button>
                
                <button
                  type="button"
                  className="text-white/60 hover:text-white/90 flex items-center gap-1.5 text-xs hover:bg-white/10 p-1.5 px-2 rounded-md transition-colors"
                  title="For best results, include details about characters, settings, emotions, lighting, and style preferences"
                >
                  <Info className="h-4 w-4" />
                  <span>Tips</span>
                </button>
              </div>
              
              <div className="relative">
                <span className="text-xs text-white/40">
                  {promptInput.trim().length > 0 ? `${promptInput.length} characters` : ""}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-white/50 mt-2 ml-1">Press Ctrl+Enter to submit</p>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleCreateManga}
            disabled={!promptInput.trim() || isProcessing}
            className="py-2 px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:opacity-90 transition-all duration-300 flex items-center gap-2"
          >
            {isProcessing ? (
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
        
        {/* Example Prompts */}
        <div className="space-y-6">
          <h2 className="text-center text-white/80 text-sm">Try these example prompts:</h2>
          
          {EXAMPLE_PROMPTS.map((category, categoryIndex) => (
            <div key={`category-${categoryIndex}`} className="space-y-3">
              <h3 className="text-xs text-white/60 text-center">{category.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {category.examples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => selectExamplePrompt(example.prompt)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{example.icon}</span>
                      <span className="text-white font-medium text-sm">{example.text}</span>
                    </div>
                    <p className="text-white/60 text-xs line-clamp-2 group-hover:text-white/80 transition-colors">
                      {example.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}