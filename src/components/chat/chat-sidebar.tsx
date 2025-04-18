'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  PlusCircle, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Trash, 
  RefreshCw,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useChat } from '@/providers/chat-provider';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ChatSidebar() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { chats, deleteChat, reloadChatsFromLocalStorage, exportAllChats, importChats } = useChat();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Debug logging for sidebar chats
  useEffect(() => {
    console.log("ChatSidebar: Current chats count:", chats.length);
    if (chats.length > 0) {
      console.log("ChatSidebar: First chat ID:", chats[0].id, "title:", chats[0].title);
    }
    
    // Also check localStorage directly to compare with state
    const savedChats = localStorage.getItem('sketchdojo-chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        console.log("ChatSidebar: localStorage chats count:", parsedChats.length);
        if (parsedChats.length > 0) {
          console.log("ChatSidebar: localStorage first chat ID:", parsedChats[0].id);
        }
      } catch (e) {
        console.error("ChatSidebar: Error parsing localStorage chats", e);
      }
    } else {
      console.log("ChatSidebar: No chats found in localStorage");
    }
  }, [chats]);
  
  // Sort chats by most recent
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  
  // Redirect to landing page for a new prompt
  const handleNewChat = () => {
    router.push('/');
  };
  
  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within the last 7 days, show day of week
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to reload chats from localStorage
  const handleReloadChats = async () => {
    setIsReloading(true);
    try {
      const success = reloadChatsFromLocalStorage();
      if (success) {
        toast.success('Chats reloaded successfully');
      } else {
        toast.error('No chats found in storage');
      }
    } catch (error) {
      console.error("Error reloading chats:", error);
      toast.error('Failed to reload chats');
    } finally {
      setTimeout(() => setIsReloading(false), 500);
    }
  };
  
  // Handle export chats functionality
  const handleExportChats = () => {
    try {
      setIsExporting(true);
      const jsonData = exportAllChats();
      
      // Create a download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sketchdojo-chats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Chats exported successfully');
    } catch (error) {
      console.error('Error exporting chats:', error);
      toast.error('Failed to export chats');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Trigger file input click
  const triggerImportDialog = () => {
    importFileRef.current?.click();
  };
  
  // Handle import file selection
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importChats(jsonData);
        
        if (success) {
          toast.success('Chats imported successfully');
        } else {
          toast.error('Invalid chat data format');
        }
      } catch (error) {
        console.error('Error importing chats:', error);
        toast.error('Failed to import chats');
      } finally {
        setIsImporting(false);
        // Reset file input
        if (importFileRef.current) {
          importFileRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  // Handle delete chat with error handling
  const handleDeleteChat = async (chatId: string) => {
    setIsDeleting(true);
    try {
      await deleteChat(chatId);
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "h-full bg-black/50 border-r border-white/10 flex flex-col transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
        )}
      >
        {/* Header with new chat button */}
        <div className="p-4 border-b border-white/10">
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-sketchdojo-primary/90 hover:bg-sketchdojo-primary text-white flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        
        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-2">
          {sortedChats.length > 0 ? (
            <div className="space-y-1 px-2">
              {sortedChats.map((chat) => {
                const isActive = pathname?.includes(chat.id);
                // Get message count and image count for display
                const messageCount = chat.messages.length;
                const imageCount = chat.messages.reduce((count, msg) => 
                  count + (msg.images?.length || 0), 0);
                
                return (
                  <div key={chat.id} className="relative group flex items-center">
                    <Link href={`/studio/chat/${chat.id}`} className="flex-1">
                      <div className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isActive ? 'bg-sketchdojo-primary/20' : 'hover:bg-white/5'}`}>
                        <MessageSquare className="w-4 h-4 text-white/70" />
                        <div className="truncate flex-1">
                          <p className="text-sm text-white/90 truncate">{chat.title}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-white/50">{formatDate(chat.updatedAt)}</p>
                            {messageCount > 0 && (
                              <span className="text-[10px] text-white/40 rounded-full bg-white/10 px-1.5 py-0.5">
                                {messageCount} msg{messageCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            {imageCount > 0 && (
                              <span className="text-[10px] text-purple-300/60 rounded-full bg-purple-500/10 px-1.5 py-0.5">
                                {imageCount} img{imageCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    {/* Delete button, only visible on hover or always visible on mobile */}
                    <button
                      className={
                        `absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/50 hover:text-red-500 hover:bg-white/10 transition-colors z-10 ` +
                        `${(isDeleting && deleteTargetId === chat.id) ? ' opacity-100' : ' opacity-0 group-hover:opacity-100'}`
                      }
                      title="Delete chat"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteTargetId(chat.id);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={isDeleting && deleteTargetId === chat.id}
                      aria-label="Delete chat"
                    >
                      {isDeleting && deleteTargetId === chat.id ? (
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin block"></span>
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500/70 mb-2" />
              <p className="text-sm text-white/50 mb-4 text-center">No chats found</p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-sketchdojo-primary/80 hover:bg-sketchdojo-primary text-white text-sm"
                size="sm"
              >
                Create your first manga
              </Button>
            </div>
          )}
        </div>
        
        {/* Footer with links and actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
            <Settings className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/70">Settings</span>
          </div>
          
          <div 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/70">Sign out</span>
          </div>
          
          <div 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            onClick={handleReloadChats}
          >
            {isReloading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <RefreshCw className="w-4 h-4 text-white/70" />
            )}
            <span className="text-sm text-white/70">
              {isReloading ? "Reloading..." : "Reload chats"}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            onClick={handleExportChats}
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 text-white/70" />
            )}
            <span className="text-sm text-white/70">
              {isExporting ? "Exporting..." : "Export chats"}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            onClick={triggerImportDialog}
          >
            {isImporting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-4 h-4 text-white/70" />
            )}
            <span className="text-sm text-white/70">
              {isImporting ? "Importing..." : "Import chats"}
            </span>
            <input 
              type="file"
              ref={importFileRef}
              className="hidden"
              accept=".json"
              onChange={handleImportFile}
            />
          </div>
        </div>
      </div>
      
      {/* Collapse toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white/70 p-1 rounded-r-md border-r border-t border-b border-white/10 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-[#18181b] rounded-xl shadow-2xl p-7 max-w-sm w-full border border-white/10 flex flex-col">
            {/* Close (X) icon */}
            <button
              className="absolute top-3 right-3 text-white/40 hover:text-white/80 p-1 rounded transition-colors"
              onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
              aria-label="Close dialog"
              disabled={isDeleting}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Delete Chat?</h3>
            <p className="text-white/70 mb-6 text-sm leading-relaxed">Are you sure you want to delete this chat? <br/>This action cannot be undone.</p>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 border border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                onClick={() => {
                  if (!deleteTargetId) return;
                  handleDeleteChat(deleteTargetId);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}