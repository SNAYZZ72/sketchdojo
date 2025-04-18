'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { geminiService } from '@/lib/chat/gemini-service';
import { stabilityService } from '@/lib/chat/stability-service';
import { storageService, STORAGE_KEYS } from '@/lib/storage-service';

// Define types for our chat
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  images?: string[]; // URLs to images
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chatId: string | null) => void;
  createChat: (title?: string) => Chat;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  generateResponse: (prompt: string) => Promise<string | null>;
  generateResponseWithNewChat: (prompt: string) => Promise<string | null>;
  generateImage: (prompt: string) => Promise<string | null>;
  isLoading: boolean;
  deleteChat: (chatId: string) => Promise<void>;
  reloadChatsFromStorage: () => boolean;
  exportAllChats: () => string;
  importChats: (jsonData: string) => boolean;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper function to format current time for chat titles
function getFormattedTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper function to create a meaningful title from a prompt
function createTitleFromPrompt(prompt: string) {
  // Extract the first few words (typically 4-6 words work well for titles)
  const words = prompt.trim().split(/\s+/);
  const titleWords = words.slice(0, 5); 
  let title = titleWords.join(' ');
  
  // If the title is too short, use more words
  if (title.length < 20 && words.length > 5) {
    title = words.slice(0, Math.min(10, words.length)).join(' ');
  }
  
  // Truncate if still too long
  if (title.length > 30) {
    title = title.substring(0, 30) + '...';
  }
  
  // Add timestamp to make each title unique and help with chronology
  return `${title} [${getFormattedTime()}]`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get data from storage using our storage service
  const getFromStorage = useCallback(() => {
    return storageService.getItem<Chat[]>(STORAGE_KEYS.CHATS, true);
  }, []);
  
  // Save data to storage using our storage service
  const saveToStorage = useCallback((data: Chat[]) => { // Changed from 'any' to 'Chat[]'
    return storageService.setItem(STORAGE_KEYS.CHATS, data);
  }, []);
  
  // Load chats from storage on initial render
  useEffect(() => {
    const loadChats = () => {
      const savedData = getFromStorage();
      if (savedData && Array.isArray(savedData)) {
        console.log('Loaded chats from storage:', savedData.length);
        setChats(savedData);
        
        // Set the most recent chat as current if no current chat is set
        if (savedData.length > 0 && !currentChat) {
          const sortedChats = [...savedData].sort((a, b) => b.updatedAt - a.updatedAt);
          setCurrentChatState(sortedChats[0]);
        }
        
        setIsInitialized(true);
        return true;
      }
      
      // No saved data or error - initialize with empty state
      console.log('No chats found in storage, initializing empty state');
      setChats([]);
      setCurrentChatState(null);
      setIsInitialized(true);
      return false;
    };
    
    loadChats();
  }, [getFromStorage, currentChat]);

  // Synchronize chats with storage
  const synchronizeChats = useCallback(() => {
    if (!isInitialized) return false;
    return saveToStorage(chats);
  }, [chats, isInitialized, saveToStorage]);

  // Save chats to storage whenever they change
  useEffect(() => {
    if (isInitialized) {
      synchronizeChats();
    }
  }, [chats, isInitialized, synchronizeChats]);
  
  // Set current chat by ID
  const setCurrentChat = useCallback((chatId: string | null) => {
    console.log('Setting current chat to:', chatId);
    if (!chatId) {
      setCurrentChatState(null);
      return;
    }
    
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      console.log('Found chat in state, setting as current:', chat.id);
      setCurrentChatState(chat);
    } else {
      console.warn(`Chat with ID ${chatId} not found in state`);
      
      // Check storage as a fallback
      const savedData = getFromStorage();
      if (savedData && Array.isArray(savedData)) {
        const savedChat = savedData.find(c => c.id === chatId);
        if (savedChat) {
          console.log('Found chat in storage, setting as current:', savedChat.id);
          
          // Update the chats array to include this chat
          const updatedChats = [...chats];
          if (!chats.some(c => c.id === savedChat.id)) {
            updatedChats.push(savedChat);
            setChats(updatedChats);
          }
          
          setCurrentChatState(savedChat);
        } else {
          console.error(`Chat with ID ${chatId} not found in storage either`);
        }
      }
    }
  }, [chats, getFromStorage]);

  // Create a new chat
  const createChat = useCallback((promptOrTitle?: string): Chat => {
    let chatTitle = 'New Chat';
    
    // Generate a meaningful title if a prompt is provided
    if (promptOrTitle && promptOrTitle.trim().length > 0) {
      chatTitle = createTitleFromPrompt(promptOrTitle);
    } else {
      // If no prompt, add a timestamp
      chatTitle = `New Chat [${getFormattedTime()}]`;
    }
    
    // Generate a unique ID
    const chatId = uuidv4();
    
    const newChat: Chat = {
      id: chatId,
      title: chatTitle,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    console.log('Creating new chat:', newChat.id);
    
    // Add to the beginning to make newest chats appear first
    setChats(prev => {
      const updatedChats = [newChat, ...prev];
      // Force save to storage immediately to prevent race conditions
      saveToStorage(updatedChats);
      return updatedChats;
    });
    
    // Set as current chat
    setCurrentChatState(newChat);
    
    return newChat;
  }, [saveToStorage]);

  // Update an existing chat
  const updateChat = useCallback((chatId: string, updatedProps: Partial<Chat>) => {
    console.log('Updating chat:', chatId);
    
    setChats(prev => {
      const chatExists = prev.some(chat => chat.id === chatId);
      
      if (!chatExists) {
        console.warn(`Attempted to update chat ${chatId} that doesn't exist in state`);
      }
      
      const updatedChats = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, ...updatedProps, updatedAt: Date.now() } 
          : chat
      );
      
      // If the chat doesn't exist in our current state, add it
      if (!chatExists) {
        const newChat: Chat = {
          id: chatId,
          title: updatedProps.title || 'Recovered Chat',
          messages: updatedProps.messages || [],
          createdAt: updatedProps.createdAt || Date.now(),
          updatedAt: Date.now()
        };
        updatedChats.unshift(newChat);
      }
      
      // Force save to storage immediately
      saveToStorage(updatedChats);
      return updatedChats;
    });
    
    // Also update current chat if it's the one being modified
    if (currentChat?.id === chatId) {
      setCurrentChatState(prev => 
        prev ? { ...prev, ...updatedProps, updatedAt: Date.now() } : prev
      );
    }
  }, [currentChat, saveToStorage]);

  // Add a message to the current chat
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentChat) {
      console.warn('No current chat to add message to');
      return;
    }
    
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now()
    };
    
    console.log('Adding message to chat:', currentChat.id);
    
    const updatedMessages = [...currentChat.messages, newMessage];
    updateChat(currentChat.id, { messages: updatedMessages });
  }, [currentChat, updateChat]);

  // Generate a response in the current chat
  const generateResponse = useCallback(async (prompt: string): Promise<string | null> => {
    console.log('Generating response for prompt in current context');
    
    // Create a new chat if needed
    let chatToUse = currentChat;
    let isNewChat = false;
    
    if (!chatToUse) {
      chatToUse = createChat(prompt);
      isNewChat = true;
      console.log('Created new chat for response:', chatToUse.id);
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };
    
    // Update chat with user message
    const updatedWithUserMessage = [...chatToUse.messages, userMessage];
    updateChat(chatToUse.id, { messages: updatedWithUserMessage });
    
    setIsLoading(true);
    try {
      // Use Gemini API to generate a text response
      const response = await geminiService.generateResponse(prompt);
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      // Generate an image if possible
      let imageUrl: string | null = null;
      
      try {
        // Try Stability API first if available
        if (process.env.NEXT_PUBLIC_STABILITY_API_KEY) {
          imageUrl = await stabilityService.generateImage(prompt);
        }
        
        // Fall back to Gemini if needed
        if (!imageUrl) {
          imageUrl = await geminiService.generateImage(prompt);
        }
        
        // Add image to assistant message if generated
        if (imageUrl) {
          assistantMessage.images = [imageUrl];
        }
      } catch (imageError) {
        console.error('Error generating image:', imageError);
        // Continue without image
      }
      
      // Update chat with assistant message
      const finalMessages = [...updatedWithUserMessage, assistantMessage];
      updateChat(chatToUse.id, { messages: finalMessages });
      
      // Make sure the updated chat is current
      if (isNewChat || !currentChat) {
        setCurrentChat(chatToUse.id);
      }
      
      // Re-synchronize with storage
      synchronizeChats();
      
      return chatToUse.id;
    } catch (error) {
      console.error('Error generating response:', error);
      return chatToUse.id; // Return chat ID even on error
    } finally {
      setIsLoading(false);
    }
  }, [createChat, currentChat, updateChat, setCurrentChat, synchronizeChats]);

  // Generate a response in a new chat
  const generateResponseWithNewChat = useCallback(async (prompt: string): Promise<string | null> => {
    console.log('Generating response with new chat for prompt');
    
    // Always create a new chat
    const newChat = createChat(prompt);
    console.log('Created new chat:', newChat.id);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };
    
    // Update new chat with user message
    const updatedMessages = [userMessage];
    updateChat(newChat.id, { messages: updatedMessages });
    
    // Make sure this new chat is set as current
    setCurrentChat(newChat.id);
    
    setIsLoading(true);
    try {
      // Generate text response
      const response = await geminiService.generateResponse(prompt);
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      // Generate image if possible
      let imageUrl: string | null = null;
      
      try {
        // Try Stability API first
        if (process.env.NEXT_PUBLIC_STABILITY_API_KEY) {
          imageUrl = await stabilityService.generateImage(prompt);
        }
        
        // Fall back to Gemini
        if (!imageUrl) {
          imageUrl = await geminiService.generateImage(prompt);
        }
        
        // Add image to message if generated
        if (imageUrl) {
          assistantMessage.images = [imageUrl];
        }
      } catch (imageError) {
        console.error('Error generating image:', imageError);
        // Continue without image
      }
      
      // Get current chat messages to ensure we have the latest state
      const chat = chats.find(c => c.id === newChat.id);
      const currentMessages = chat ? chat.messages : updatedMessages;
      
      // Update chat with assistant message
      const finalMessages = [...currentMessages, assistantMessage];
      updateChat(newChat.id, { messages: finalMessages });
      
      // Re-synchronize with storage
      synchronizeChats();
      
      return newChat.id;
    } catch (error) {
      console.error('Error generating response:', error);
      return newChat.id; // Return chat ID even on error
    } finally {
      setIsLoading(false);
    }
  }, [createChat, updateChat, chats, setCurrentChat, synchronizeChats]);

  // Generate just an image
  const generateImage = useCallback(async (prompt: string): Promise<string | null> => {
    try {
      // Try Stability API first
      if (process.env.NEXT_PUBLIC_STABILITY_API_KEY) {
        const stabilityImage = await stabilityService.generateImage(prompt);
        if (stabilityImage) return stabilityImage;
      }
      
      // Fall back to Gemini
      return await geminiService.generateImage(prompt);
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }, []);

  // Delete a chat
  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    console.log('Deleting chat:', chatId);
    
    // Remove from chats array
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId);
      // Force synchronize with storage
      saveToStorage(updatedChats);
      return updatedChats;
    });
    
    // Update current chat if needed
    if (currentChat?.id === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        const sortedChats = [...remainingChats].sort((a, b) => b.updatedAt - a.updatedAt);
        setCurrentChatState(sortedChats[0]);
      } else {
        setCurrentChatState(null);
      }
    }
  }, [chats, currentChat, saveToStorage]);

  // Reload chats from storage
  const reloadChatsFromStorage = useCallback((): boolean => {
    console.log('Reloading chats from storage');
    
    const savedData = getFromStorage();
    if (savedData && Array.isArray(savedData)) {
      setChats(savedData);
      
      // Update current chat if it exists in the reloaded data
      if (currentChat) {
        const reloadedCurrentChat = savedData.find(chat => chat.id === currentChat.id);
        if (reloadedCurrentChat) {
          setCurrentChatState(reloadedCurrentChat);
        } else {
          // Current chat no longer exists, set to most recent
          if (savedData.length > 0) {
            const sortedChats = [...savedData].sort((a, b) => b.updatedAt - a.updatedAt);
            setCurrentChatState(sortedChats[0]);
          } else {
            setCurrentChatState(null);
          }
        }
      }
      
      return true;
    }
    return false;
  }, [currentChat, getFromStorage]);

  // Export all chats as JSON string
  const exportAllChats = useCallback((): string => {
    return JSON.stringify(chats);
  }, [chats]);

  // Import chats from JSON string
  const importChats = useCallback((jsonData: string): boolean => {
    try {
      const importedChats = JSON.parse(jsonData);
      if (Array.isArray(importedChats)) {
        // Validate imported data
        const validChats = importedChats.filter(chat => 
          chat && 
          typeof chat === 'object' && 
          chat.id && 
          chat.title && 
          Array.isArray(chat.messages)
        );
        
        if (validChats.length > 0) {
          // Merge with existing or replace
          setChats(validChats);
          saveToStorage(validChats);
          
          // Set current chat to the most recent imported chat
          const sortedChats = [...validChats].sort((a, b) => b.updatedAt - a.updatedAt);
          setCurrentChatState(sortedChats[0]);
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error importing chats:', error);
      return false;
    }
  }, [saveToStorage]);

  const value = {
    chats,
    currentChat,
    setCurrentChat,
    createChat,
    addMessage,
    generateResponse,
    generateResponseWithNewChat,
    generateImage,
    isLoading,
    deleteChat,
    reloadChatsFromStorage,
    exportAllChats,
    importChats
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 