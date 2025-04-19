'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertTriangle,
  Menu,
  X,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useChat } from '@/providers/chat-provider';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

// Key for saving sidebar collapsed state
const SIDEBAR_STATE_KEY = 'sketchdojo-chat-sidebar-collapsed';

export function ChatSidebar() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const importFileRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { chats, deleteChat, reloadChatsFromStorage, exportAllChats, importChats } = useChat();
  const { signOut, user } = useAuth();
  
  // Initialize with a default state that's the same for both server and client
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Load the saved state from localStorage only on the client side after initial render
  useEffect(() => {
    // Check localStorage for saved state
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
    
    // Check screen size for medium screens to auto-collapse
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && window.innerWidth >= 768) {
      setIsCollapsed(true);
    }
  }, []);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
  }, [isCollapsed]);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
    };
    
    // Set on mount
    checkMobile();
    
    // Listen for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Focus search input when search is activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);
  
  // Sort chats by most recent and filter by search query if active
  const filteredAndSortedChats = [...chats]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .filter(chat => {
      if (!searchQuery.trim()) return true;
      return chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
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
  
  // Get initials for user avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase() || '').join('');
  };
  
  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to reload chats from localStorage
  const handleReloadChats = async () => {
    setIsReloading(true);
    try {
      const success = reloadChatsFromStorage();
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
  
  // Function to create a new chat
  const handleCreateNewChat = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    // Add a small delay for the animation to complete
    setTimeout(() => {
      router.push('/');
    }, 100);
  };
  
  // Handle mobile navigation item click
  const handleMobileItemClick = () => {
    // Add a small delay to make navigation feel more natural
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 150);
  };
  
  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  // Toggle search mode
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      // Reset search query when activating search
      setSearchQuery('');
    }
  };

  // Desktop sidebar content
  const DesktopSidebarContent = () => (
    <>
      {/* Header with new chat button */}
      <div className={cn(
        "py-3 border-b border-gray-200 dark:border-white/10",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <Button 
              onClick={handleCreateNewChat}
              className="w-10 h-10 p-0 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white shadow-md transition-all duration-300"
              aria-label="New Chat"
            >
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleCreateNewChat}
            className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Button>
        )}
      </div>
      
      {/* Search and filter section */}
      {!isCollapsed && (
        <div className="p-3 border-b border-gray-200 dark:border-white/10">
          <AnimatePresence mode="wait">
            {isSearchActive ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSearchQuery(newValue);
                  }}
                  className="w-full h-9 py-2 px-3 flex-1 bg-gray-100 dark:bg-white/10 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-sketchdojo-primary text-gray-900 dark:text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                  className="ml-1 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSearch}
                  className="flex-1 justify-start bg-gray-100 dark:bg-white/10 border-0 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span>Search</span>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2 bg-gray-100 dark:bg-white/10 border-0 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Filter chats</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {filteredAndSortedChats.length > 0 ? (
          <div className="space-y-1 px-2">
            {filteredAndSortedChats.map((chat) => {
              const isActive = pathname?.includes(chat.id);
              // Get message count and image count for display
              const messageCount = chat.messages.length;
              const imageCount = chat.messages.reduce((count, msg) => 
                count + (msg.images?.length || 0), 0);
              
              return (
                <motion.div 
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative group flex items-center"
                >
                  <Link href={`/studio/chat/${chat.id}`} className="flex-1">
                    <div className={cn(
                      "flex items-center gap-2 rounded-md transition-all duration-200 border",
                      isActive 
                        ? "bg-gradient-to-r from-sketchdojo-primary/10 to-sketchdojo-accent/10 border-sketchdojo-primary/20" 
                        : "hover:bg-gray-100 dark:hover:bg-white/5 border-transparent",
                      isCollapsed ? "p-2 justify-center" : "p-2.5 justify-start"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center",
                        isActive && "text-sketchdojo-primary"
                      )}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      
                      {!isCollapsed && (
                        <div className="truncate flex-1 min-w-0">
                          <p className={cn(
                            "text-sm truncate transition-colors",
                            isActive ? "text-sketchdojo-primary font-medium" : "text-gray-700 dark:text-white/80"
                          )}>
                            {chat.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 dark:text-white/50">{formatDate(chat.updatedAt)}</p>
                            <div className="flex items-center gap-1">
                              {messageCount > 0 && (
                                <span className="text-[10px] text-gray-500 dark:text-white/40 rounded-full bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 flex items-center">
                                  {messageCount} msg{messageCount !== 1 ? 's' : ''}
                                </span>
                              )}
                              {imageCount > 0 && (
                                <span className="text-[10px] text-purple-600 dark:text-purple-300/60 rounded-full bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 flex items-center">
                                  {imageCount} img{imageCount !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {isActive && isCollapsed && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sketchdojo-primary to-sketchdojo-accent rounded-r-md"></div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Delete button (only visible for expanded sidebar) */}
                  {!isCollapsed && (
                    <div className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-opacity duration-200",
                      (isDeleting && deleteTargetId === chat.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-gray-500 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTargetId(chat.id);
                                setShowDeleteConfirm(true);
                              }}
                              disabled={isDeleting && deleteTargetId === chat.id}
                              aria-label="Delete chat"
                            >
                              {isDeleting && deleteTargetId === chat.id ? (
                                <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                              ) : (
                                <Trash className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">Delete chat</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {searchQuery ? (
              // No search results
              <div className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-gray-500 dark:text-white/50" />
                </div>
                <p className="text-sm text-gray-600 dark:text-white/70 font-medium mb-1">No results found</p>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">Try different search terms</p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              // No chats
              <div className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-sm text-gray-700 dark:text-white/70 font-medium mb-1">No chats found</p>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">Create your first manga chat</p>
                {!isCollapsed && (
                  <Button 
                    onClick={() => router.push('/')}
                    className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white text-xs shadow-sm"
                    size="sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    New Chat
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer with actions and user profile */}
      <div className="mt-auto border-t border-gray-200 dark:border-white/10 pt-2">
        {/* Action buttons */}
        {!isCollapsed ? (
          <div className="px-3 py-1">
            <div className="grid grid-cols-2 gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReloadChats}
                      disabled={isReloading}
                      className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                    >
                      {isReloading ? (
                        <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                      ) : (
                        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-white/70" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{isReloading ? "Reloading..." : "Reload chats"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportChats}
                      disabled={isExporting}
                      className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                    >
                      {isExporting ? (
                        <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                      ) : (
                        <Download className="w-4 h-4 text-gray-600 dark:text-white/70" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{isExporting ? "Exporting..." : "Export chats"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerImportDialog}
                      disabled={isImporting}
                      className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                    >
                      {isImporting ? (
                        <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                      ) : (
                        <Upload className="w-4 h-4 text-gray-600 dark:text-white/70" />
                      )}
                      <input 
                        type="file"
                        ref={importFileRef}
                        className="hidden"
                        accept=".json"
                        onChange={handleImportFile}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{isImporting ? "Importing..." : "Import chats"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/studio/settings')}
                      className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                    >
                      <Settings className="w-4 h-4 text-gray-600 dark:text-white/70" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          // Collapsed action buttons
          <div className="flex flex-col items-center gap-2 px-2 py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReloadChats}
                    disabled={isReloading}
                    className="h-8 w-8 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    {isReloading ? (
                      <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Reload chats</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/studio/settings')}
                    className="h-8 w-8 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* User profile section */}
        <div className={cn(
          "px-3 py-3 border-t border-gray-200 dark:border-white/10",
          isCollapsed ? "flex justify-center" : "flex items-center justify-between"
        )}>
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9 border-2 border-transparent hover:border-sketchdojo-primary transition-colors">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 mt-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/studio/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/studio/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="p-1.5 h-auto flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-left text-gray-700 dark:text-white/80 w-full justify-start"
                  >
                    <Avatar className="h-8 w-8 border-2 border-transparent">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs text-gray-500 dark:text-white/50">Free Plan</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/studio/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/studio/settings" className="cursor-pointer">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        
        {/* Collapse/Expand button */}
        <div className="p-3 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "text-gray-600 dark:text-white/70 transition-all duration-300 border-gray-200 dark:border-white/10 hover:border-sketchdojo-primary dark:hover:border-sketchdojo-primary hover:text-sketchdojo-primary dark:hover:text-sketchdojo-primary bg-gray-50 dark:bg-white/5",
              isCollapsed ? "w-10 h-10 p-0 rounded-full" : "w-full"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
  
  // Mobile sidebar content
  const MobileSidebarContent = () => (
    <>
      {/* Mobile Header with Logo and Close button */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        <Link 
          href="/studio" 
          className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white"
          onClick={handleMobileItemClick}
        >
          <MessageSquare className="w-6 h-6 text-sketchdojo-primary" />
          Your Chats
        </Link>
        
        <SheetClose asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </SheetClose>
      </div>
      
      {/* Mobile search bar */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white/50 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 dark:bg-white/10 border-0 focus-visible:ring-1 focus-visible:ring-sketchdojo-primary"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-500 dark:text-white/50"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Chat List */}
      <div className="flex-1 overflow-y-auto py-3">
        {filteredAndSortedChats.length > 0 ? (
          <div className="space-y-2 px-3">
            {filteredAndSortedChats.map((chat) => {
              const isActive = pathname?.includes(chat.id);
              const messageCount = chat.messages.length;
              const imageCount = chat.messages.reduce((count, msg) => 
                count + (msg.images?.length || 0), 0);
              
              return (
                <div key={chat.id} className="relative group">
                  <Link 
                    href={`/studio/chat/${chat.id}`} 
                    className="block"
                    onClick={handleMobileItemClick}
                  >
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border",
                      isActive 
                        ? "bg-gradient-to-r from-sketchdojo-primary/10 to-sketchdojo-accent/10 border-sketchdojo-primary/20" 
                        : "hover:bg-gray-100 dark:hover:bg-white/5 border-transparent"
                    )}>
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-white/10",
                        isActive && "text-sketchdojo-primary"
                      )}>
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-base truncate transition-colors",
                          isActive ? "text-sketchdojo-primary font-medium" : "text-gray-700 dark:text-white/80"
                        )}>
                          {chat.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-gray-500 dark:text-white/50">{formatDate(chat.updatedAt)}</p>
                          <div className="flex items-center gap-1">
                            {messageCount > 0 && (
                              <span className="text-[10px] text-gray-500 dark:text-white/40 rounded-full bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 flex items-center">
                                {messageCount} msg{messageCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            {imageCount > 0 && (
                              <span className="text-[10px] text-purple-600 dark:text-purple-300/60 rounded-full bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 flex items-center">
                                {imageCount} img{imageCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete button for mobile */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteTargetId(chat.id);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={isDeleting && deleteTargetId === chat.id}
                        aria-label="Delete chat"
                      >
                        {isDeleting && deleteTargetId === chat.id ? (
                          <span className="w-5 h-5 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin block"></span>
                        ) : (
                          <Trash className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] p-4 text-center">
            {searchQuery ? (
              // No search results
              <div className="animate-fadeIn">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-500 dark:text-white/50" />
                </div>
                <p className="text-lg text-gray-700 dark:text-white/80 font-medium mb-2">No results found</p>
                <p className="text-sm text-gray-500 dark:text-white/50 mb-4">Try different search terms</p>
                <Button 
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              // No chats
              <div className="animate-fadeIn">
                <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-lg text-gray-700 dark:text-white/80 font-medium mb-2">No chats found</p>
                <p className="text-sm text-gray-500 dark:text-white/50 mb-4">Create your first manga chat</p>
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile actions */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleReloadChats}
            disabled={isReloading}
            className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
          >
            {isReloading ? (
              <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin"></span>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{isReloading ? "Reloading..." : "Reload"}</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={triggerImportDialog}
            disabled={isImporting}
            className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
          >
            {isImporting ? (
              <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin"></span>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isImporting ? "Importing..." : "Import"}</span>
            <input 
              type="file"
              ref={importFileRef}
              className="hidden"
              accept=".json"
              onChange={handleImportFile}
            />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportChats}
            disabled={isExporting}
            className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
          >
            {isExporting ? (
              <span className="w-4 h-4 border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white rounded-full animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/studio/settings')}
            className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile user section */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border-2 border-transparent">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-sm text-gray-500 dark:text-white/50">Free Plan</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="ml-2 text-red-500 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
  
  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <motion.div
      className="md:hidden fixed top-4 left-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 bg-white/10 backdrop-blur-lg text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 shadow-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button - only visible on mobile */}
      {isMobile && !isCollapsed && <MobileMenuToggle />}
      
      {/* Mobile Drawer with improved animation */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <Sheet open={true} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent 
              side="left" 
              className="p-0 w-[320px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-xl"
            >
              {/* SheetTitle is required for accessibility, but we hide it visually */}
              <div className="sr-only">
                <SheetTitle>Chat Navigation</SheetTitle>
              </div>
              
              <div className="w-full h-full flex flex-col">
                <MobileSidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ width: isCollapsed ? 64 : 280 }}
        animate={{ width: isCollapsed ? 64 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden md:flex h-full flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 z-30",
          isCollapsed ? "items-center" : ""
        )}
      >
        <style jsx global>{`
          /* Custom scrollbar for sidebar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
          }
          
          /* Dark mode adjustments */
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          /* Animation utilities */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
        <DesktopSidebarContent />
      </motion.div>
      
      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => {
              // Close when clicking the background
              if (e.target === e.currentTarget) {
                setShowDeleteConfirm(false);
                setDeleteTargetId(null);
              }
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-white/10 flex flex-col"
            >
              {/* Close (X) icon */}
              <button
                className="absolute top-4 right-4 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/80 p-1 rounded-full transition-colors"
                onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
                aria-label="Close dialog"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-start mb-4">
                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full mr-4">
                  <Trash className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Delete Chat?</h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm">
                    Are you sure you want to delete this chat? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-white dark:bg-transparent border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/80"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    if (!deleteTargetId) return;
                    handleDeleteChat(deleteTargetId);
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}