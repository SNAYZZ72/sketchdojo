'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, Download, Eye, 
  ChevronDown, ChevronRight, Layout, LayoutGrid, Maximize2, Heart, Bookmark, PanelRight,
  Edit3, PlusCircle, Move, Copy, Trash, MousePointer, Layers,
  AlertCircle, MessageSquare
} from 'lucide-react';
import { useChat } from '@/providers/chat-provider';
import { Message, LoadingMessage } from '@/components/chat/message';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAutoRedirectFromPrompt } from '@/lib/auto-redirect';
//import { ChatInputCompact } from '@/components/chat/chat-input-compact';
import { cn } from '@/lib/utils';
import { ChatMessages } from '@/components/chat/chat-messages';
import { PromptForm } from '@/components/chat/prompt-form';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  //const searchParams = useSearchParams();
  const chatId = params.id as string;
  const { chats, currentChat, setCurrentChat, generateResponse, generateResponseWithNewChat, createChat, isLoading, deleteChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  //const [showMorePanels, setShowMorePanels] = useState(false);
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<'preview' | 'editor'>('preview');
  const [zoom, setZoom] = useState(100);
  const [selectedEditorPanel, setSelectedEditorPanel] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use our auto-redirect hook to handle any initial prompts
  useAutoRedirectFromPrompt(createChat, generateResponse, generateResponseWithNewChat);

  // Set current chat based on ID
  useEffect(() => {
    console.log("ChatPage: Checking chat ID:", chatId);
    console.log("ChatPage: Current chat:", currentChat?.id);
    console.log("ChatPage: Total chats in provider:", chats.length);

    if (chatId) {
      // Check if this chat exists in our chats array
      const chatExists = chats.some(c => c.id === chatId);
      console.log("ChatPage: Chat exists in provider:", chatExists);
      
      // If the chat doesn't exist in our provider, try to load it from localStorage
      if (!chatExists) {
        console.log("ChatPage: Chat not found in provider, checking localStorage");
        const savedChats = localStorage.getItem('sketchdojo-chats');
        
        if (savedChats) {
          try {
            const parsedChats = JSON.parse(savedChats);
            const localChat = parsedChats.find((c: any) => c.id === chatId);
            
            if (localChat) {
              console.log("ChatPage: Found chat in localStorage:", localChat.id);
              // We found the chat in localStorage, but we can't directly add it to the provider
              // since we don't have access to setChats. 
              // Let's just log this for debugging purposes
            } else {
              console.log("ChatPage: Chat not found in localStorage either");
              // Consider redirecting to the studio page if chat is not found anywhere
              // router.push('/studio/chat');
            }
          } catch (error) {
            console.error("ChatPage: Error parsing localStorage chats:", error);
          }
        }
      }
      
      // Set the current chat regardless
      if (!currentChat || currentChat.id !== chatId) {
        console.log("ChatPage: Setting current chat to:", chatId);
        setCurrentChat(chatId);
      }
    }
  }, [chatId, currentChat, chats, setCurrentChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
    await generateResponse(content);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Adjust zoom in the editor
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 30));
  const handleZoomReset = () => setZoom(100);

  const handleDeleteChat = () => {
    if (!currentChat) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChat = () => {
    if (!currentChat) return;
    deleteChat(currentChat.id);
    setShowDeleteConfirm(false);
    router.push('/studio/chat');
  };

  const cancelDeleteChat = () => {
    setShowDeleteConfirm(false);
  };

  if (!currentChat) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-t-transparent border-purple-500 animate-spin"></div>
          <div className="text-white/70">Loading your manga...</div>
        </div>
      </div>
    );
  }

  // Filter for assistant messages with images
  const panelsToDisplay = currentChat.messages
    .filter(m => m.role === 'assistant' && m.images && m.images.length > 0)
    .flatMap((message, messageIndex) => 
      message.images?.map((image, imageIndex) => ({
        url: image,
        id: `${message.id}-${imageIndex}`,
        panelNumber: messageIndex * 10 + imageIndex + 1
      })) || []
    );

  // Set the first panel as selected if we have panels and none selected
  useEffect(() => {
    if (panelsToDisplay.length > 0 && selectedPanel === null) {
      setSelectedPanel(0);
    }
    if (panelsToDisplay.length > 0 && selectedEditorPanel === null) {
      setSelectedEditorPanel(0);
    }
  }, [panelsToDisplay, selectedPanel, selectedEditorPanel]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-black/80 border border-white/10 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium text-white">Delete Chat</h3>
            </div>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                onClick={cancelDeleteChat}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteChat}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    
      {/* Header */}
      <div className="bg-black/70 border-b border-white/10 p-2 px-3 sm:px-4 flex items-center justify-between h-12 sm:h-14 backdrop-blur-sm">
        <div className="text-white font-bold flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400 hover:bg-purple-500/20 transition-colors"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" /> : <PanelRight className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <div className="flex flex-col">
            <span className="text-purple-400 text-sm sm:text-base">SketchDojo</span>
            <span className="text-[10px] sm:text-xs text-white/60 -mt-1">Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          {currentChat && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-red-400 flex items-center gap-1 hover:bg-red-500/10 transition-colors h-8 px-2 sm:px-3" 
              onClick={handleDeleteChat}
            >
              <Trash className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white flex items-center gap-1 hover:bg-white/10 transition-colors h-8 px-2 sm:px-3" 
            onClick={() => {}}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 shadow-lg shadow-purple-700/20 transition-all h-8 px-2 sm:px-3"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Section */}
        <div className={`${isCollapsed ? 'w-0 overflow-hidden' : 'w-1/3'} transition-all duration-300 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-sm`}>
          <div className="p-3 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-white font-medium text-sm flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Chat
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" id="chat-messages">
            <ChatMessages />
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/20">
            <PromptForm />
          </div>
        </div>

        {/* Preview/Editor Section */}
        <div className={`${isCollapsed ? 'w-full' : 'flex-1'} flex flex-col transition-all duration-300`}>
          {/* Tab bar */}
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
                  <Edit3 className="h-3 w-3" />
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
                  <Eye className="h-3 w-3" />
                  <span className="hidden xs:inline">Preview</span>
                </span>
              </button>
            </div>
            
            {/* Update view controls for mobile */}
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
                >
                  <Layout className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={cn(
                    "p-1 sm:p-1.5 rounded-md transition-colors", 
                    viewMode === 'grid' 
                      ? "bg-purple-600 text-white" 
                      : "bg-black/30 text-white/60 hover:text-white hover:bg-black/50"
                  )}
                >
                  <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            )}
            
            {/* Make zoom controls more compact on mobile */}
            {activeMode === 'editor' && (
              <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4">
                <div className="flex items-center bg-black/30 rounded-lg p-1">
                  <button 
                    onClick={handleZoomOut}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span className="text-white/70 text-[10px] sm:text-xs px-1 sm:px-2">{zoom}%</span>
                  <button 
                    onClick={handleZoomIn}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Adjust the preview mode to be responsive */}
          {activeMode === 'preview' && (
            <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900/80 to-black/90 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Preview header - simplify on mobile */}
              <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-between p-2 sm:p-3 border-b border-white/5">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="bg-purple-600/20 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center text-purple-400">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/90 text-xs sm:text-sm font-medium">Manga Preview</span>
                    <span className="text-white/40 text-[10px] sm:text-xs">{panelsToDisplay.length} panels</span>
                  </div>
                </div>
                
                {/* Simplify controls on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="bg-black/40 hover:bg-black/60 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 rounded-full h-6 sm:h-8 px-2 sm:px-3 flex items-center gap-1 text-white shadow-lg shadow-purple-600/20 transition-colors">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-[10px] sm:text-xs">Download</span>
                  </button>
                </div>
              </div>
              
              {/* Responsive manga panels */}
              {viewMode === 'vertical' ? (
                <div className="flex flex-col items-center gap-4 sm:gap-6 px-3 sm:px-6 py-4 sm:py-8">
                  {panelsToDisplay.length > 0 ? (
                    panelsToDisplay.map((panel, index) => (
                      <div 
                        key={panel.id} 
                        className="w-full max-w-3xl group relative"
                        onClick={() => setSelectedPanel(index)}
                      >
                        <div className={cn(
                          "transition-all duration-300 rounded-xl overflow-hidden shadow-xl sm:shadow-2xl",
                          selectedPanel === index 
                            ? "ring-2 sm:ring-4 ring-purple-500 ring-offset-2 sm:ring-offset-4 ring-offset-black/50" 
                            : "border border-white/10 hover:border-white/30"
                        )}>
                          <img 
                            src={panel.url} 
                            alt={`Panel ${panel.panelNumber}`} 
                            className="w-full h-auto bg-black/40 hover:scale-[1.01] transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 sm:p-4">
                            <div className="p-1 sm:p-2 text-white text-xs sm:text-sm font-medium backdrop-blur-sm bg-black/30 rounded-lg">
                              Panel {panel.panelNumber}
                            </div>
                            <div className="flex gap-2">
                              <button className="p-1 sm:p-2 backdrop-blur-sm bg-black/30 rounded-lg text-white/80 hover:text-white">
                                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 flex justify-between">
                          <span className="text-white/60 text-xs sm:text-sm">
                            {index + 1} of {panelsToDisplay.length}
                          </span>
                          <div className="flex gap-1">
                            <button className="text-white/60 hover:text-white p-1">
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button className="text-white/60 hover:text-white p-1">
                              <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-white/50 py-10 sm:py-20 px-4 flex flex-col items-center justify-center gap-3 sm:gap-4 bg-black/30 rounded-xl max-w-md mx-auto mt-6 sm:mt-10 border border-white/5">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-black/50 flex items-center justify-center">
                        <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white/30" />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-white text-sm sm:text-base font-medium">No manga panels yet</h3>
                        <p className="text-white/50 text-xs sm:text-sm">Start a conversation to create your manga. Describe your characters, setting, and story.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {panelsToDisplay.length > 0 ? (
                    panelsToDisplay.map((panel, index) => (
                      <div 
                        key={panel.id} 
                        className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                        onClick={() => setSelectedPanel(index)}
                      >
                        <img 
                          src={panel.url} 
                          alt={`Panel ${panel.panelNumber}`} 
                          className="w-full h-auto aspect-[3/4] object-cover bg-black/40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs sm:text-sm font-medium flex justify-between items-center">
                            <span>Panel {panel.panelNumber}</span>
                            <button className="bg-black/50 p-1 rounded hover:bg-black/70">
                              <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                        {selectedPanel === index && (
                          <div className="absolute inset-0 border-2 sm:border-4 border-purple-500 rounded-lg pointer-events-none"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 xs:col-span-2 md:col-span-3 text-center text-white/50 py-10 sm:py-20 flex flex-col items-center justify-center gap-3 sm:gap-4 bg-black/30 rounded-xl border border-white/5">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-black/50 flex items-center justify-center">
                        <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white/30" />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-white text-sm sm:text-base font-medium">No manga panels yet</h3>
                        <p className="text-white/50 text-xs">Start a conversation to create your manga.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Thumbnail navigation - more compact on mobile */}
              {panelsToDisplay.length > 0 && (
                <div className="sticky bottom-0 w-full bg-black/70 backdrop-blur-md border-t border-white/10 p-2 flex items-center justify-center">
                  <div className="w-full max-w-2xl flex items-center gap-2">
                    <div className="text-white/60 text-xs w-8 sm:w-14 text-center">
                      {selectedPanel !== null ? selectedPanel + 1 : 1}/{panelsToDisplay.length}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {panelsToDisplay.map((panel, index) => (
                        <button
                          key={`thumb-${panel.id}`}
                          onClick={() => setSelectedPanel(index)}
                          className={cn(
                            "h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border rounded-md overflow-hidden transition-all",
                            selectedPanel === index 
                              ? "border-purple-500 shadow-lg shadow-purple-500/30" 
                              : "border-white/10 hover:border-white/30"
                          )}
                        >
                          <img 
                            src={panel.url} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="h-full w-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                    <div className="w-8 sm:w-14 flex justify-end">
                      <button className="bg-black/50 hover:bg-black/70 rounded-full h-7 w-7 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Editor Mode */}
          {activeMode === 'editor' && (
            <div className="flex flex-1 overflow-hidden">
              {/* Editor Canvas */}
              <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto relative p-4">
                <div 
                  className="min-h-full w-full min-w-full flex items-center justify-center relative"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(75, 75, 75, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform origin-center"
                    style={{ transform: `translate(-50%, -50%) scale(${zoom/100})` }}
                  >
                    {/* Canvas Content */}
                    <div className="w-[1200px] h-[800px] flex flex-wrap gap-4 p-8 content-start">
                      {panelsToDisplay.length > 0 ? (
                        panelsToDisplay.map((panel, index) => (
                          <div 
                            key={panel.id} 
                            className={cn(
                              "group border relative cursor-move", 
                              selectedEditorPanel === index 
                                ? "border-purple-500 shadow-xl shadow-purple-500/20"
                                : "border-white/10 hover:border-white/30"
                            )}
                            style={{ width: '280px', height: '350px' }}
                            onClick={() => setSelectedEditorPanel(index)}
                          >
                            <img 
                              src={panel.url} 
                              alt={`Panel ${panel.panelNumber}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 flex justify-between items-center">
                              <span className="text-white/80 text-xs">Panel {panel.panelNumber}</span>
                              <div className="flex gap-1">
                                <button className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">
                                  <Trash className="h-3 w-3" />
                                </button>
                                <button className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">
                                  <Edit3 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white/40 max-w-md">
                            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-black/30 flex items-center justify-center">
                              <Layers className="h-10 w-10 text-white/20" />
                            </div>
                            <h3 className="text-white/80 text-lg mb-2">No Manga Panels Yet</h3>
                            <p className="text-white/40 text-sm mb-4">Start a conversation in the chat to generate manga panels that you can edit here.</p>
                            <Button 
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => setActiveMode('preview')}
                            >
                              Switch to Preview
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Editor Tools Sidebar */}
              <div className="w-64 border-l border-white/10 bg-black/50 p-3 backdrop-blur-sm flex flex-col">
                <div className="text-white/80 font-medium text-sm mb-4 pb-2 border-b border-white/10">Editor Tools</div>
                
                <div className="space-y-4">
                  <div className="p-2 bg-black/20 rounded-lg">
                    <div className="text-white/60 text-xs mb-2">Tools</div>
                    <div className="grid grid-cols-4 gap-1">
                      <button className="flex flex-col items-center justify-center p-2 rounded bg-purple-600/20 hover:bg-purple-600/30 text-white/80">
                        <MousePointer className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Select</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-2 rounded bg-black/30 hover:bg-black/40 text-white/60">
                        <Move className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Move</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-2 rounded bg-black/30 hover:bg-black/40 text-white/60">
                        <PlusCircle className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Add</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-2 rounded bg-black/30 hover:bg-black/40 text-white/60">
                        <Trash className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only floating action button to toggle chat panel */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="md:hidden fixed bottom-4 right-4 z-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
