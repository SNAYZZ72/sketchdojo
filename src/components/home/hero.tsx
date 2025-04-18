"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { Loader2, Sparkles, Send, Info, Paperclip, X, Wand2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import TextareaAutosize from 'react-textarea-autosize';

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { geminiService } from "@/lib/chat/gemini-service";
import { storageService, STORAGE_KEYS } from "@/lib/storage-service";

// Enhanced prompt examples with categories and icons
const promptCategories = [
  {
    category: "Popular Genres",
    examples: [
      { 
        id: 1, 
        text: "Aventure futuriste", 
        prompt: "Un samouraï cybernétique dans un Tokyo futuriste, néons lumineux et pluie artificielle",
        icon: "🌆"
      },
      { 
        id: 2, 
        text: "Romance historique", 
        prompt: "Une rencontre romantique entre deux personnages dans le Japon féodal, sous la floraison des cerisiers",
        icon: "🌸" 
      },
      { 
        id: 3, 
        text: "Fantasy épique", 
        prompt: "Un ninja aux pouvoirs mystiques affrontant un dragon ancestral dans un temple oublié",
        icon: "🐉" 
      },
    ]
  },
  {
    category: "Everyday Life",
    examples: [
      { 
        id: 4, 
        text: "Slice of life", 
        prompt: "Une journée tranquille dans un café de quartier, ambiance chaleureuse et personnages expressifs",
        icon: "☕" 
      },
      { 
        id: 5, 
        text: "Action intense", 
        prompt: "Un duel de sabre sous la pluie, deux silhouettes s'affrontant avec détermination",
        icon: "⚔️" 
      },
      { 
        id: 6, 
        text: "Science-fiction", 
        prompt: "Une astronaute explorant une planète inconnue avec une faune et flore extraterrestre",
        icon: "🚀" 
      }
    ]
  }
];

// PromptInput component with enhanced UI
const PromptInput = () => {
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update character count when prompt changes
  useEffect(() => {
    setCharacterCount(promptValue.length);
  }, [promptValue]);
  
  // Handle actions based on authentication status
  const handleAuthAction = (action: () => void | Promise<void>) => {
    if (isAuthLoading) {
      // Still checking auth state, do nothing yet
      return;
    }
    
    if (!user) {
      // Not authenticated, redirect to sign in
      router.push("/studio/sign-in");
      return;
    }
    
    // User is authenticated, perform the action
    action();
  };
  
  // Handle focus on the prompt input
  const handlePromptFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (isAuthLoading) return;
    
    if (!user) {
      e.preventDefault();
      router.push("/studio/sign-in");
    }
  };
  
  // Handle the prompt submission
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    handleAuthAction(() => {
      // Set loading state
      setIsLoading(true);
      
      try {
        console.log("Hero: Submitting prompt:", promptValue.slice(0, 30));
        // For authenticated users, store the prompt in localStorage via storageService
        storageService.setItem(STORAGE_KEYS.INITIAL_PROMPT, promptValue);
        console.log("Hero: Saved prompt to storage service, redirecting with directProcess=true");
        
        // IMPORTANT: Make sure directProcess is set to true to ensure a new chat is created
        router.push('/studio/chat?directProcess=true');
      } catch (error) {
        console.error('Error handling prompt submission:', error);
        setIsLoading(false);
      }
    });
  };
  
  // Handle enhancing the prompt with AI
  const enhancePromptWithAI = async () => {
    handleAuthAction(async () => {
      if (!promptValue.trim()) return;
      
      setIsEnhancing(true);
      
      try {
        // Use the Gemini service to enhance the prompt
        const enhancedPrompt = await geminiService.enhancePrompt(promptValue);
        setPromptValue(enhancedPrompt);
      } catch (error) {
        console.error('Error enhancing prompt:', error);
        // If error occurs, fall back to a simple enhancement
        const fallbackEnhanced = `${promptValue} [Enhanced with dramatic lighting, detailed character expressions, vibrant colors, and dynamic composition]`;
        setPromptValue(fallbackEnhanced);
      } finally {
        setIsEnhancing(false);
      }
    });
  };
  
  // Handle selecting an example prompt
  const selectExample = (prompt: string) => {
    handleAuthAction(() => {
      setPromptValue(prompt);
      
      // Set loading state
      setIsLoading(true);
      
      try {
        console.log("Hero: Selected example prompt:", prompt.slice(0, 30));
        // Store the prompt using storageService
        storageService.setItem(STORAGE_KEYS.INITIAL_PROMPT, prompt);
        console.log("Hero: Saved example to storage service, redirecting with directProcess=true");
        
        // IMPORTANT: Make sure directProcess is set to true to ensure a new chat is created
        router.push('/studio/chat?directProcess=true');
      } catch (error) {
        console.error('Error handling example selection:', error);
        setIsLoading(false);
      }
    });
  };
  
  // Clear the prompt input
  const clearPrompt = () => {
    setPromptValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle clicking the attach button
  const handleAttachClick = () => {
    handleAuthAction(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    });
  };
  
  // Handle file selection for attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
        
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove the selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <form onSubmit={handlePromptSubmit} className="relative">
        <div className="relative prompt-input rounded-2xl shadow-lg shadow-sketchdojo-primary/20 transition-all duration-300 focus-within:shadow-sketchdojo-primary/40 border-2 border-sketchdojo-primary/20 focus-within:border-sketchdojo-primary/40 bg-black/30 backdrop-blur-md">
          <div className="flex items-start">
            <Sparkles className="absolute left-3 sm:left-5 top-4 text-sketchdojo-primary/70 h-4 sm:h-5 w-4 sm:w-5" />
            
            {/* Auto-expanding textarea replacing the Input component */}
            <TextareaAutosize
              ref={inputRef}
              id="main-prompt-input"
              placeholder="Describe your manga idea..."
              value={promptValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                // Only allow typing if authenticated or checking auth
                if (user || isAuthLoading) {
                  setPromptValue(e.target.value);
                  
                }
              }}
              onFocus={handlePromptFocus}
              className={`w-full min-h-[64px] py-4 pl-10 sm:pl-14 pr-10 sm:pr-12 text-base sm:text-lg rounded-2xl border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-white/50 resize-none ${!user && !isAuthLoading ? "cursor-pointer" : ""}`}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePromptSubmit(e);
                }
              }}
            />
            
            {promptValue && (
              <button
                type="button"
                onClick={clearPrompt}
                className="absolute right-3 sm:right-5 top-4 text-white/50 hover:text-white transition-colors bg-black/40 rounded-full p-1 backdrop-blur-sm"
                aria-label="Clear input"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Show loading state while checking auth */}
          {isAuthLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-sketchdojo-primary/30 border-t-sketchdojo-primary rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Image preview section */}
          {imagePreview && (
            <div className="px-3 sm:px-5 py-2 border-t border-white/10">
              <div className="relative inline-block">
                <div className="relative group">
                  <Image 
                    src={imagePreview} 
                    alt="Attached image" 
                    className="h-16 sm:h-20 w-auto rounded-lg object-cover border border-white/20"
                    width={80}
                    height={80}
                    unoptimized={true}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-black/80 rounded-full p-1 text-white/80 hover:text-white border border-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Character counter, attachment and visibility controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-xs text-white/50 px-3 sm:px-5 py-2 border-t border-white/10 gap-3 sm:gap-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span>
                {characterCount > 0 ? `${characterCount} characters` : ""}
              </span>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {/* Attach button */}
              <button
                type="button"
                onClick={handleAttachClick}
                className={`flex items-center gap-1 sm:gap-1.5 text-white/60 hover:text-white/90 transition-colors ${!user && !isAuthLoading ? "cursor-pointer" : ""}`}
              >
                <Paperclip className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                <span>Attach</span>
              </button>
              
              {/* Enhance Prompt button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={enhancePromptWithAI}
                      className={`flex items-center gap-1 sm:gap-1.5 text-white/60 hover:text-white/90 transition-colors ${!user && !isAuthLoading ? "cursor-pointer" : ""}`}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? (
                        <Loader2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                      )}
                      <span>{isEnhancing ? "Enhancing..." : "Enhance"}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black/90 border-sketchdojo-primary/50 text-white max-w-xs p-3">
                    <p className="text-xs">Use AI to enhance your prompt with details about style, lighting, and composition</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <Info className="h-3 w-3 mr-1" />
                      <span className="text-[10px] sm:text-xs">Prompt tips</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black/90 border-sketchdojo-primary/50 text-white max-w-xs p-3">
                    <p className="text-xs">Be specific about your manga style, characters, setting, and mood for better results. Try including details about lighting, emotions, and action.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Public/Private toggle */}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs">Public</span>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-sketchdojo-primary h-4 w-7 sm:h-5 sm:w-10"
                />
              </div>
              
              {/* Create button */}
              <button 
                type="submit" 
                className="h-7 sm:h-8 px-3 sm:px-4 rounded-full transition-all duration-300 flex items-center justify-center bg-sketchdojo-primary hover:bg-sketchdojo-primary/90 text-white text-xs sm:text-sm opacity-80 hover:opacity-100"
                disabled={isLoading}
              >
                <div className="flex items-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-1 h-3 w-3" />
                      <span>Create</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Example prompts section */}
      <div className="mt-6 sm:mt-10 flex flex-col items-center space-y-4 sm:space-y-6">
        <h3 className="text-white/90 font-medium text-sm sm:text-base">Try these examples:</h3>
        
        {promptCategories.map((category, index) => (
          <div key={index} className="w-full">
            <h4 className="text-xs sm:text-sm text-white/70 mb-2 sm:mb-3 text-center">{category.category}</h4>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {category.examples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => selectExample(example.prompt)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs sm:text-sm transition-all duration-300 text-white/90 hover:text-white hover:border-white/20 hover:shadow-md hover:shadow-sketchdojo-primary/10 flex items-center"
                >
                  <span className="mr-1 sm:mr-2">{example.icon}</span>
                  {example.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 py-16 sm:py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#080808] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sketchdojo-primary via-sketchdojo-accent to-sketchdojo-primary bg-[length:200%_100%] animate-gradient"></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto text-center z-10 relative">
        <div className="inline-block mb-6 sm:mb-8">
          <div className="relative">
            <span className="absolute inset-0 blur-xl bg-sketchdojo-primary/30 rounded-full transform scale-150"></span>
            <span className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90">
              ✨ AI-Powered Manga Creation
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary via-white to-sketchdojo-accent">
          Idea to manga in seconds.
        </h1>
        
        <h2 className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-16 max-w-2xl mx-auto leading-relaxed px-2">
          SketchDojo transforms your descriptions into professional manga art with AI—no drawing skills required
        </h2>
        
        <PromptInput />
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-48 sm:w-64 h-48 sm:h-64 bg-sketchdojo-primary/20 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-24 w-48 sm:w-64 h-48 sm:h-64 bg-sketchdojo-accent/20 rounded-full blur-3xl opacity-60 animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 sm:w-32 h-24 sm:h-32 bg-sketchdojo-primary/10 rounded-full blur-xl opacity-60 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 sm:w-20 h-16 sm:h-20 bg-sketchdojo-accent/10 rounded-full blur-xl opacity-40 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent to-black/90 opacity-70"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30"></div>
      </div>
    </section>
  );
};