'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paperclip, Send, ArrowLeft, Save, Download, Share2, Eye, 
  ChevronDown, ChevronUp, ChevronRight, Sparkles, 
  Layout, LayoutGrid, Maximize2, Heart, Bookmark, PanelRight,
  Edit3, PlusCircle, Move, Copy, Trash, MousePointer, Layers,
  AlertCircle
} from 'lucide-react';
import { useChat } from '@/providers/chat-provider';
import { Message, LoadingMessage } from '@/components/chat/message';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAutoRedirectFromPrompt } from '@/lib/auto-redirect';
import { ChatInputCompact } from '@/components/chat/chat-input-compact';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProcess = searchParams.get('directProcess') === 'true';
  const { currentChat, generateResponse, generateResponseWithNewChat, createChat, isLoading, deleteChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMorePanels, setShowMorePanels] = useState(false);
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<'preview' | 'editor'>('preview');
  const [zoom, setZoom] = useState(100);
  const [selectedEditorPanel, setSelectedEditorPanel] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // If direct processing is requested, check for a prompt and redirect
  useEffect(() => {
    if (directProcess) {
      const processPrompt = async () => {
        const initialPrompt = localStorage.getItem('initial_prompt');
        
        if (initialPrompt) {
          console.log("Found initial prompt with directProcess param, processing...");
          
          // Clear it from localStorage so we don't reprocess it
          localStorage.removeItem('initial_prompt');
          
          try {
            // Generate the response with a new chat and get the chat ID
            const chatId = await generateResponseWithNewChat(initialPrompt);
            
            if (chatId) {
              // Redirect to the specific chat page
              console.log("Generated manga with directProcess, redirecting to:", chatId);
              router.push(`/studio/chat/${chatId}`);
            } else {
              // If generation failed, create a chat to redirect to
              console.log("Error during generation with directProcess");
              const newChat = createChat(initialPrompt.slice(0, 30));
              router.push(`/studio/chat/${newChat.id}`);
            }
          } catch (error) {
            console.error("Error processing prompt with directProcess:", error);
            // Create a chat to redirect to
            const newChat = createChat(initialPrompt.slice(0, 30));
            router.push(`/studio/chat/${newChat.id}`);
          }
        }
      };
      
      processPrompt();
    }
  }, [directProcess, createChat, generateResponseWithNewChat, router]);

  // Use our auto-redirect hook to handle any initial prompts
  useAutoRedirectFromPrompt(createChat, generateResponse, generateResponseWithNewChat);

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

  // Filter for assistant messages with images
  const panelsToDisplay = currentChat?.messages
    ?.filter(m => m.role === 'assistant' && m.images && m.images.length > 0)
    ?.flatMap((message, messageIndex) => 
      message.images?.map((image, imageIndex) => ({
        url: image,
        id: `${message.id}-${imageIndex}`,
        panelNumber: messageIndex * 10 + imageIndex + 1
      })) || []
    ) || [];

  // Set the first panel as selected if we have panels and none selected
  useEffect(() => {
    if (panelsToDisplay.length > 0 && selectedPanel === null) {
      setSelectedPanel(0);
    }
    if (panelsToDisplay.length > 0 && selectedEditorPanel === null) {
      setSelectedEditorPanel(0);
    }
  }, [panelsToDisplay, selectedPanel, selectedEditorPanel]);

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
      <div className="bg-black/70 border-b border-white/10 p-2 px-4 flex items-center justify-between h-14 backdrop-blur-sm">
        <div className="text-white font-bold flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-purple-400 mr-1 hover:bg-purple-500/20 transition-colors"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
          </Button>
          <div className="flex flex-col">
            <span className="text-purple-400">SketchDojo</span>
            <span className="text-xs text-white/60 -mt-1">Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentChat && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-red-400 flex items-center gap-1 hover:bg-red-500/10 transition-colors" 
              onClick={handleDeleteChat}
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white flex items-center gap-1 hover:bg-white/10 transition-colors" onClick={() => {}}>
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 shadow-lg shadow-purple-700/20 transition-all">
            <Download className="h-4 w-4" />
            <span>Export</span>
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
            {currentChat?.messages?.map((message) => (
              <Message key={message.id} message={message} />
            )) || []}
            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/20">
            <ChatInputCompact
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onEnhance={(value) => {
                // Enhance functionality would go here
                console.log('Enhancing:', value);
              }}
              onAttach={() => {
                // Attach functionality would go here
                console.log('Attach clicked');
              }}
              isPublic={true}
              onTogglePublic={(value) => {
                // Toggle public functionality would go here
                console.log('Toggle public:', value);
              }}
            />
          </div>
        </div>

        {/* Preview/Editor Section */}
        <div className={`${isCollapsed ? 'w-full' : 'flex-1'} flex flex-col transition-all duration-300`}>
          {/* Tab bar */}
          <div className="bg-black/60 p-2 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
            <div className="flex bg-black/50 rounded-md overflow-hidden p-0.5 mx-4">
              <button 
                onClick={() => setActiveMode('editor')}
                className={cn(
                  "px-4 py-1.5 text-xs transition-colors",
                  activeMode === 'editor' 
                    ? "text-white bg-gradient-to-r from-purple-800 to-purple-600 rounded-sm shadow-sm" 
                    : "text-white/60 bg-transparent hover:text-white/80"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Edit3 className="h-3 w-3" />
                  Editor
                </span>
              </button>
              <button 
                onClick={() => setActiveMode('preview')}
                className={cn(
                  "px-4 py-1.5 text-xs transition-colors",
                  activeMode === 'preview' 
                    ? "text-white bg-gradient-to-r from-purple-800 to-purple-600 rounded-sm shadow-sm" 
                    : "text-white/60 bg-transparent hover:text-white/80"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3" />
                  Preview
                </span>
              </button>
            </div>
            
            {activeMode === 'preview' && (
              <div className="flex items-center gap-2 mr-4">
                <button 
                  onClick={() => setViewMode('vertical')} 
                  className={cn(
                    "p-1.5 rounded-md transition-colors", 
                    viewMode === 'vertical' 
                      ? "bg-purple-600 text-white" 
                      : "bg-black/30 text-white/60 hover:text-white hover:bg-black/50"
                  )}
                >
                  <Layout className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={cn(
                    "p-1.5 rounded-md transition-colors", 
                    viewMode === 'grid' 
                      ? "bg-purple-600 text-white" 
                      : "bg-black/30 text-white/60 hover:text-white hover:bg-black/50"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {activeMode === 'editor' && (
              <div className="flex items-center gap-2 mr-4">
                <div className="flex items-center bg-black/30 rounded-lg p-1">
                  <button 
                    onClick={handleZoomOut}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span className="text-white/70 text-xs px-2">{zoom}%</span>
                  <button 
                    onClick={handleZoomIn}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

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
                        <Edit3 className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Edit</span>
                      </button>
                    </div>
                  </div>
                  
                  {selectedEditorPanel !== null && (
                    <div className="p-2 bg-black/20 rounded-lg">
                      <div className="text-white/60 text-xs mb-2">Selected Panel</div>
                      <div className="aspect-[3/4] w-full bg-black/30 rounded-md overflow-hidden mb-2">
                        <img 
                          src={panelsToDisplay[selectedEditorPanel]?.url} 
                          alt="Selected panel" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-xs">Panel {selectedEditorPanel + 1}</span>
                          <div className="flex gap-1">
                            <button className="p-1 rounded bg-black/30 text-white/60 hover:bg-black/50 hover:text-white">
                              <Copy className="h-3 w-3" />
                            </button>
                            <button className="p-1 rounded bg-black/30 text-white/60 hover:bg-black/50 hover:text-white">
                              <Trash className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs">
                          Edit Panel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-2 bg-black/20 rounded-lg">
                    <div className="text-white/60 text-xs mb-2">Project</div>
                    <div className="space-y-1">
                      <Button size="sm" variant="ghost" className="w-full justify-start text-white/60 hover:text-white text-xs">
                        <Save className="h-3 w-3 mr-2" />
                        Save Project
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full justify-start text-white/60 hover:text-white text-xs">
                        <Download className="h-3 w-3 mr-2" />
                        Export as PDF
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full justify-start text-white/60 hover:text-white text-xs">
                        <Share2 className="h-3 w-3 mr-2" />
                        Share Project
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveMode('preview')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Mode
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Preview Mode */}
          {activeMode === 'preview' && (
            <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900/80 to-black/90 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Preview header */}
              <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-between p-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-600/20 rounded-full h-8 w-8 flex items-center justify-center text-purple-400">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium">Manga Preview</span>
                    <span className="text-white/40 text-xs">{panelsToDisplay.length} panels</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="bg-black/40 hover:bg-black/60 rounded-full h-8 w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="bg-black/40 hover:bg-black/60 rounded-full h-8 w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button className="bg-black/40 hover:bg-black/60 rounded-full h-8 px-3 flex items-center gap-1 text-white/70 hover:text-white transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 rounded-full h-8 px-3 flex items-center gap-1 text-white shadow-lg shadow-purple-600/20 transition-colors">
                    <Download className="h-4 w-4" />
                    <span className="text-xs">Download</span>
                  </button>
                </div>
              </div>
              
              {/* Manga panels */}
              {viewMode === 'vertical' ? (
                <div className="flex flex-col items-center gap-6 px-6 py-8">
                  {panelsToDisplay.length > 0 ? (
                    panelsToDisplay.map((panel, index) => (
                      <div 
                        key={panel.id} 
                        className="w-full max-w-3xl group relative"
                        onClick={() => setSelectedPanel(index)}
                      >
                        <div className={cn(
                          "transition-all duration-300 rounded-xl overflow-hidden shadow-2xl",
                          selectedPanel === index 
                            ? "ring-4 ring-purple-500 ring-offset-4 ring-offset-black/50" 
                            : "border border-white/10 hover:border-white/30"
                        )}>
                          <img 
                            src={panel.url} 
                            alt={`Panel ${panel.panelNumber}`} 
                            className="w-full h-auto bg-black/40 hover:scale-[1.01] transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                            <div className="p-2 text-white text-sm font-medium backdrop-blur-sm bg-black/30 rounded-lg">
                              Panel {panel.panelNumber}
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 backdrop-blur-sm bg-black/30 rounded-lg text-white/80 hover:text-white">
                                <Maximize2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <span className="text-white/60 text-sm">
                            {index + 1} of {panelsToDisplay.length}
                          </span>
                          <div className="flex gap-1">
                            <button className="text-white/60 hover:text-white p-1">
                              <Heart className="h-4 w-4" />
                            </button>
                            <button className="text-white/60 hover:text-white p-1">
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-white/50 py-20 px-4 flex flex-col items-center justify-center gap-4 bg-black/30 rounded-xl max-w-md mx-auto mt-10 border border-white/5">
                      <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white/30" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white font-medium">No manga panels yet</h3>
                        <p className="text-white/50 text-sm">Start a conversation to create your manga. Describe your characters, setting, and story.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
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
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium flex justify-between items-center">
                            <span>Panel {panel.panelNumber}</span>
                            <button className="bg-black/50 p-1 rounded hover:bg-black/70">
                              <Maximize2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {selectedPanel === index && (
                          <div className="absolute inset-0 border-4 border-purple-500 rounded-lg pointer-events-none"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-white/50 py-20 flex flex-col items-center justify-center gap-4 bg-black/30 rounded-xl border border-white/5">
                      <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white/30" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white font-medium">No manga panels yet</h3>
                        <p className="text-white/50 text-sm">Start a conversation to create your manga.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Thumbnail navigation */}
              {panelsToDisplay.length > 0 && (
                <div className="sticky bottom-0 w-full bg-black/70 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-center gap-2">
                  <div className="w-full max-w-2xl flex items-center gap-2">
                    <div className="text-white/60 text-xs w-16">
                      Panel {selectedPanel !== null ? selectedPanel + 1 : 1}/{panelsToDisplay.length}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-1 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {panelsToDisplay.map((panel, index) => (
                        <button
                          key={`thumb-${panel.id}`}
                          onClick={() => setSelectedPanel(index)}
                          className={cn(
                            "h-14 w-14 flex-shrink-0 border rounded-md overflow-hidden transition-all",
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
                    <div className="w-16 flex justify-end">
                      <button className="bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}