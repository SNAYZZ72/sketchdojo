'use client';

import React from 'react';
import { 
  Download, 
  Save, 
  Trash, 
  ChevronRight, 
  PanelRight, 
  Share2, 
  MoreHorizontal,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/providers/chat-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  chat?: Chat;
  onToggleSidebar: () => void;
  onDelete: () => void;
  isCollapsed: boolean;
}

/**
 * Enhanced header component for the chat interface displaying title and action buttons
 */
export function ChatHeader({ 
  chat, 
  onToggleSidebar, 
  onDelete, 
  isCollapsed 
}: ChatHeaderProps) {
  // Format the date to a readable format
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get message and image counts
  const getMessageCount = () => {
    if (!chat) return 0;
    return chat.messages.length;
  };
  
  const getImageCount = () => {
    if (!chat) return 0;
    return chat.messages.reduce((count, msg) => 
      count + (msg.images?.length || 0), 0
    );
  };

  // Function to export the current chat
  const handleExport = () => {
    // Would implement export functionality here
    console.log('Export functionality to be implemented');
  };

  // Function to save the current chat
  const handleSave = () => {
    // Would implement save functionality here
    console.log('Save functionality to be implemented');
  };
  
  // Function to share the current chat
  const handleShare = () => {
    // Would implement share functionality here
    console.log('Share functionality to be implemented');
  };

  return (
    <div className="bg-white dark:bg-gray-900/95 border-b border-gray-200 dark:border-white/10 py-2 px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16 shadow-sm backdrop-blur-sm">
      {/* Left side with logo and title */}
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                onClick={onToggleSidebar}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" /> 
                ) : (
                  <PanelRight className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Logo and Title */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sketchdojo-primary dark:text-sketchdojo-primary font-medium text-base sm:text-lg">
                {chat?.title ? (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="line-clamp-1"
                  >
                    {chat.title}
                  </motion.span>
                ) : (
                  "SketchDojo Studio"
                )}
              </span>
            </div>
            
            {/* Show chat info if available */}
            {chat && (
              <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-500 dark:text-white/50">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(chat.updatedAt)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{getMessageCount()} messages</span>
                </div>
                
                {getImageCount() > 0 && (
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full">
                    {getImageCount()} images
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right side with action buttons */}
      <div className="flex items-center">
        {/* Desktop view buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors h-9"
                  onClick={onDelete}
                >
                  <Trash className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors h-9"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save this chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors h-9"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share this chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-sketchdojo-primary/20 transition-all h-9"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
        </div>
        
        {/* Mobile view - icon only buttons */}
        <div className="flex sm:hidden items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-600 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            onClick={onDelete}
            aria-label="Delete chat"
          >
            <Trash className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={handleSave}
            aria-label="Save chat"
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 bg-sketchdojo-primary/90 hover:bg-sketchdojo-primary text-white"
            onClick={handleExport}
            aria-label="Export chat"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {/* More options dropdown for mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}