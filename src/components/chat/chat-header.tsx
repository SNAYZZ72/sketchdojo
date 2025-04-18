'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Download, Save, Trash, ChevronRight, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/providers/chat-provider';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  chat: Chat;
  onToggleSidebar: () => void;
  onDelete: () => void;
  isCollapsed: boolean;
}

/**
 * Header component for the chat interface displaying title and action buttons
 */
export function ChatHeader({ 
  onToggleSidebar, 
  onDelete, 
  isCollapsed 
}: ChatHeaderProps) {
  const router = useRouter();

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

  return (
    <div className="bg-black/70 border-b border-white/10 p-2 px-3 sm:px-4 flex items-center justify-between h-12 sm:h-14 backdrop-blur-sm">
      <div className="text-white font-bold flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400 hover:bg-purple-500/20 transition-colors"
          onClick={onToggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" /> 
          ) : (
            <PanelRight className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
        <div className="flex flex-col">
          <span className="text-purple-400 text-sm sm:text-base">SketchDojo</span>
          <span className="text-[10px] sm:text-xs text-white/60 -mt-1">Studio</span>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "text-white/70 hover:text-red-400 flex items-center gap-1 hover:bg-red-500/10",
            "transition-colors h-8 px-2 sm:px-3"
          )}
          onClick={onDelete}
          aria-label="Delete chat"
        >
          <Trash className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "text-white/70 hover:text-white flex items-center gap-1 hover:bg-white/10",
            "transition-colors h-8 px-2 sm:px-3"
          )}
          onClick={handleSave}
          aria-label="Save chat"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button 
          size="sm" 
          className={cn(
            "bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1",
            "shadow-lg shadow-purple-700/20 transition-all h-8 px-2 sm:px-3"
          )}
          onClick={handleExport}
          aria-label="Export chat"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
}