'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Download, MoreHorizontal, Copy, BotIcon, Reply, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageProps } from '@/types';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Message({ message }: { message: MessageProps }) {
  const isUser = message.role === 'user';
  
  // Get message styles based on sender
  const getMessageStyles = () => {
    if (isUser) {
      return {
        container: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700",
        text: "text-gray-900 dark:text-white",
        name: "text-gray-900 dark:text-white",
        avatar: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
      };
    } else {
      return {
        container: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-sm",
        text: "text-gray-900 dark:text-white",
        name: "text-sketchdojo-primary dark:text-sketchdojo-primary",
        avatar: "border-sketchdojo-primary/20 dark:border-sketchdojo-primary/20 bg-white dark:bg-gray-900"
      };
    }
  };
  
  const styles = getMessageStyles();
  
  // Parse markdown content safely
  const renderedContent = React.useMemo(() => {
    try {
      const options = {
        breaks: true,
        gfm: true,
      };
      return marked.parse(message.content || '', options);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      
      // Fallback to simple text with line breaks
      return message.content
        ? message.content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br />')
        : '';
    }
  }, [message.content]);
  
  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Copy message content to clipboard
  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      // Could add a toast notification here
      console.log('Message copied to clipboard');
    });
  };
  
  // Download all images at once
  const downloadAllImages = () => {
    if (!message.images || message.images.length === 0) return;
    
    message.images.forEach((imageUrl, index) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `sketchdojo-image-${new Date().getTime()}-${index}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-3 px-4 py-4 rounded-xl mb-3 border',
        styles.container
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        'mt-0.5 h-9 w-9 border-2',
        styles.avatar
      )}>
        <AvatarImage src={message.avatarSrc} alt={message.role} />
        <AvatarFallback className={cn(
          "text-xs font-semibold",
          isUser ? "text-gray-700 dark:text-white" : "text-sketchdojo-primary"
        )}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 overflow-hidden min-w-0">
        {/* Message header */}
        <div className="flex items-center justify-between mb-2">
          <div className={cn(
            'text-sm font-medium',
            styles.name
          )}>
            {message.role === 'user' ? 'You' : 'SketchDojo AI'}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 dark:text-white/60">
              {formatTime(message.timestamp)}
            </span>
            
            {/* Message actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white/80">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={copyMessageToClipboard} className="cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy message
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Reply className="mr-2 h-4 w-4" />
                  Reply to this
                </DropdownMenuItem>
                {!isUser && (
                  <DropdownMenuItem className="cursor-pointer">
                    <Star className="mr-2 h-4 w-4" />
                    Save to favorites
                  </DropdownMenuItem>
                )}
                {message.images && message.images.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={downloadAllImages} className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      Download all images
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Message content with markdown */}
        <div 
          className={cn(
            "prose dark:prose-invert max-w-none text-base leading-relaxed", 
            "prose-pre:p-2 prose-pre:rounded-md prose-pre:bg-gray-100 dark:prose-pre:bg-black/60", 
            "prose-code:text-sketchdojo-primary dark:prose-code:text-sketchdojo-primary/90",
            "prose-a:text-sketchdojo-primary dark:prose-a:text-sketchdojo-primary/90",
            "prose-headings:text-gray-900 dark:prose-headings:text-white",
            "prose-strong:text-gray-900 dark:prose-strong:text-white",
            "prose-em:text-gray-700 dark:prose-em:text-white/90",
            styles.text
          )}
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        
        {/* Display images if any */}
        {message.images && message.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {message.images.map((image, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50">
                <Image 
                  src={image} 
                  alt={`Generated image ${idx + 1}`} 
                  className="w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02] bg-gray-50 dark:bg-gray-900/60" 
                  width={600}
                  height={400}
                  unoptimized={true}
                  priority={false}
                />
                
                {/* Hover overlay with controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                  <span className="text-white/90 text-sm font-medium">Image {idx + 1}</span>
                  
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top">Open in new tab</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={image} 
                            download={`sketchdojo-image-${new Date().getTime()}-${idx}.png`}
                            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top">Download image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/40 mb-3 shadow-sm"
    >
      <div className="flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-sketchdojo-primary/30">
          <BotIcon className="w-5 h-5 text-sketchdojo-primary" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1.5">
          <div className="text-sm font-medium text-sketchdojo-primary">SketchDojo AI</div>
          <div className="text-[10px] text-gray-500 dark:text-white/60 ml-2 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
            Generating
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sketchdojo-primary/80 animate-pulse"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-sketchdojo-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-sketchdojo-primary/40 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-white/70 ml-2">Creating your manga...</span>
        </div>
      </div>
    </motion.div>
  );
}