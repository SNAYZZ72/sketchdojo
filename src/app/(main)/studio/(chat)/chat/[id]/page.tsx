'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/providers/chat-provider';
import { useAutoRedirectFromPrompt } from '@/lib/auto-redirect';
import { cn } from '@/lib/utils';

// Components
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { PromptForm } from '@/components/chat/prompt-form';
import { ChatImageGallery } from '@/components/chat/chat-image-gallery';
import { ChatImageEditor } from '@/components/chat/chat-image-editor';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';
import { DeleteConfirmDialog } from '@/components/chat/delete-confirm-dialog';
import { MobileMenuButton } from '@/components/chat/mobile-menu-button';

/**
 * Main Chat Page Component
 * Handles the display of a specific chat conversation and its associated images
 */
export default function ChatPage() {
  // Router and params
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  
  // Chat provider state
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    generateResponse, 
    generateResponseWithNewChat, 
    createChat, 
    deleteChat, 
    reloadChatsFromStorage
  } = useChat();

  // Local state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState<'preview' | 'editor'>('preview');
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [chatLoadRetries, setChatLoadRetries] = useState(0);
  const [chatNotFound, setChatNotFound] = useState(false);

  // Use auto-redirect hook for handling initial prompts
  useAutoRedirectFromPrompt(createChat, generateResponse, generateResponseWithNewChat);

  // Set current chat based on URL parameter with retry logic
  useEffect(() => {
    // Function to load chat with retry mechanism
    const loadChat = async () => {
      console.log(`ChatPage: Attempting to load chat ID: ${chatId} (Attempt ${chatLoadRetries + 1})`);
      
      // If we have retries, add a delay
      if (chatLoadRetries > 0) {
        // Wait longer with each retry
        await new Promise(resolve => setTimeout(resolve, chatLoadRetries * 300));
      }
      
      // Try to reload from storage for retries
      if (chatLoadRetries > 0) {
        console.log("ChatPage: Reloading chats from storage before retry");
        reloadChatsFromStorage();
      }
      
      // Check if chat exists in provider
      const chatExists = chats.some(c => c.id === chatId);
      console.log(`ChatPage: Chat exists in provider: ${chatExists}`);
      
      if (chatExists) {
        console.log(`ChatPage: Setting current chat to: ${chatId}`);
        setCurrentChat(chatId);
        setIsPageLoading(false);
        return;
      }
      
      // If we've reached max retries, show not found state
      if (chatLoadRetries >= 3) {
        console.log("ChatPage: Max retries reached, showing not found state");
        setChatNotFound(true);
        setIsPageLoading(false);
        return;
      }
      
      // Increment retry counter and try again
      setChatLoadRetries(prev => prev + 1);
    };
    
    // Run the load function
    if (chatId && (!currentChat || currentChat.id !== chatId)) {
      loadChat();
    } else {
      // We already have the right chat loaded
      setIsPageLoading(false);
    }
  }, [chatId, currentChat, chats, setCurrentChat, chatLoadRetries, reloadChatsFromStorage]);

  // Handle chat deletion
  const handleDeleteChat = async () => {
    if (!currentChat) return;
    
    try {
      await deleteChat(currentChat.id);
      setShowDeleteConfirm(false);
      router.push('/studio/chat');
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 30));
  const handleZoomReset = () => setZoom(100);

  // Extract panels from current chat messages
  const extractPanels = () => {
    if (!currentChat) return [];
    
    return currentChat.messages
      .filter(m => m.role === 'assistant' && m.images && m.images.length > 0)
      .flatMap((message, messageIndex) => 
        message.images?.map((image, imageIndex) => ({
          url: image,
          id: `${message.id}-${imageIndex}`,
          panelNumber: messageIndex * 10 + imageIndex + 1
        })) || []
      );
  };

  const panels = extractPanels();

  // Set the first panel as selected if none is selected
  useEffect(() => {
    if (panels.length > 0 && selectedPanel === null) {
      setSelectedPanel(0);
    }
  }, [panels, selectedPanel]);

  // Handle retry when chat is not found
  const handleRetry = () => {
    setIsPageLoading(true);
    setChatNotFound(false);
    setChatLoadRetries(0);
  };

  // Handle navigation to create new chat
  const handleCreateNewChat = () => {
    router.push('/studio/chat/new');
  };

  // Show loading state while loading
  if (isPageLoading) {
    return <ChatLoadingState message={`Loading your manga experience... ${chatLoadRetries > 0 ? `(Attempt ${chatLoadRetries})` : ''}`} />;
  }
  
  // Show not found state if chat doesn't exist after retries
  if (chatNotFound || !currentChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Chat Not Found</h2>
          <p className="text-white/70 mb-6">
            We couldn&apos;t find the chat you&apos;re looking for (ID: {chatId.substring(0, 8)}...).
            It might have been deleted or hasn&apos;t been fully saved yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleCreateNewChat}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Create New Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onConfirm={handleDeleteChat}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    
      {/* Header with controls */}
      <ChatHeader
        chat={currentChat}
        onToggleSidebar={toggleSidebar}
        onDelete={() => setShowDeleteConfirm(true)}
        isCollapsed={sidebarCollapsed}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Messages Section */}
        <div className={cn(
          "transition-all duration-300 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-sm",
          sidebarCollapsed ? "w-0 overflow-hidden" : "w-1/3"
        )}>
          <div className="p-3 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-white font-medium text-sm flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Chat
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <ChatMessages />
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/20">
            <PromptForm />
          </div>
        </div>

        {/* Preview/Editor Section */}
        <div className={cn(
          "flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-full" : "flex-1"
        )}>
          {/* Mode Selection Tabs */}
          <div className="bg-black/60 p-2 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
            <div className="flex bg-black/50 rounded-md overflow-hidden p-0.5 mx-2 sm:mx-4">
              <button 
                onClick={() => setActiveMode('editor')}
                className={cn(
                  "px-3 py-1.5 text-xs transition-colors",
                  activeMode === 'editor' 
                    ? "text-white bg-gradient-to-r from-purple-800 to-purple-600 rounded-sm shadow-sm" 
                    : "text-white/60 bg-transparent hover:text-white/80"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span className="hidden xs:inline">Editor</span>
                </span>
              </button>
              <button 
                onClick={() => setActiveMode('preview')}
                className={cn(
                  "px-3 py-1.5 text-xs transition-colors",
                  activeMode === 'preview' 
                    ? "text-white bg-gradient-to-r from-purple-800 to-purple-600 rounded-sm shadow-sm" 
                    : "text-white/60 bg-transparent hover:text-white/80"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="hidden xs:inline">Preview</span>
                </span>
              </button>
            </div>
            
            {/* View mode controls for Preview mode */}
            {activeMode === 'preview' && (
              <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4">
                <button 
                  onClick={() => setViewMode('vertical')} 
                  className={cn(
                    "p-1 sm:p-1.5 rounded-md transition-colors", 
                    viewMode === 'vertical' 
                      ? "bg-purple-600 text-white" 
                      : "bg-black/30 text-white/60 hover:text-white hover:bg-black/50"
                  )}
                  aria-label="Vertical view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={cn(
                    "p-1 sm:p-1.5 rounded-md transition-colors", 
                    viewMode === 'grid' 
                      ? "bg-purple-600 text-white" 
                      : "bg-black/30 text-white/60 hover:text-white hover:bg-black/50"
                  )}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Zoom controls for Editor mode */}
            {activeMode === 'editor' && (
              <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4">
                <div className="flex items-center bg-black/30 rounded-lg p-1">
                  <button 
                    onClick={handleZoomOut}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                    aria-label="Zoom out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span className="text-white/70 text-xs px-1">{zoom}%</span>
                  <button 
                    onClick={handleZoomIn}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                    aria-label="Zoom in"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button 
                    onClick={handleZoomReset}
                    className="p-1 text-white/60 hover:text-white transition-colors ml-1"
                    aria-label="Reset zoom"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2v6h-6"></path>
                      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                      <path d="M3 22v-6h6"></path>
                      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main content based on active mode */}
          {activeMode === 'preview' && (
            <ChatImageGallery
              panels={panels}
              viewMode={viewMode}
              selectedPanel={selectedPanel}
              onSelectPanel={setSelectedPanel}
            />
          )}
          
          {activeMode === 'editor' && (
            <ChatImageEditor
              panels={panels}
              zoom={zoom}
              selectedPanel={selectedPanel}
              onSelectPanel={setSelectedPanel}
            />
          )}
        </div>
      </div>

      {/* Mobile toggle button */}
      {sidebarCollapsed && (
        <MobileMenuButton onClick={toggleSidebar} />
      )}
    </div>
  );
}