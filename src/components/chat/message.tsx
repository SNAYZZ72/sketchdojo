'use client';

import React from 'react';
import { User, BotIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageProps } from '@/types';
import { roleToColor } from '@/lib/colors';
import { marked } from 'marked';

export function Message({ message }: { message: MessageProps }) {
  const isUser = message.role === 'user';
  const colorKey = roleToColor(message.role);
  
  // Get explicit colors based on role instead of dynamic class names
  const getBgColor = () => {
    if (isUser) return 'bg-zinc-800'; 
    switch (colorKey) {
      case 'purple': return 'bg-purple-900/50';
      case 'blue': return 'bg-blue-900/50';
      case 'gray': return 'bg-gray-800/50';
      default: return 'bg-zinc-800/70';
    }
  };
  
  const getBorderColor = () => {
    if (isUser) return 'border-zinc-700'; 
    switch (colorKey) {
      case 'purple': return 'border-purple-700';
      case 'blue': return 'border-blue-700';
      case 'gray': return 'border-gray-700';
      default: return 'border-zinc-700';
    }
  };
  
  const getTextColor = () => {
    if (isUser) return 'text-white'; 
    switch (colorKey) {
      case 'purple': return 'text-purple-300';
      case 'blue': return 'text-blue-300';
      case 'gray': return 'text-gray-300';
      default: return 'text-white';
    }
  };

  // Parse markdown content safely
  const renderedContent = React.useMemo(() => {
    try {
      return marked.parse(message.content || '');
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

  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-4 rounded-lg mb-3 border',
      getBgColor(),
      getBorderColor()
    )}>
      <Avatar className={cn(
        'mt-0.5 h-8 w-8 border',
        isUser 
          ? 'border-zinc-600 bg-zinc-800' 
          : 'border-white/20 bg-black/60'
      )}>
        <AvatarImage src={message.avatarSrc} alt={message.role} />
        <AvatarFallback className="text-xs font-semibold text-white">
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 overflow-hidden">
        {/* Message header */}
        <div className="flex items-center justify-between mb-2">
          <div className={cn(
            'text-sm font-medium',
            getTextColor()
          )}>
            {message.role === 'user' ? 'You' : 'SketchDojo'}
          </div>
          
          <div className="text-[10px] text-white/60">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        {/* Message content with markdown */}
        <div 
          className="prose prose-invert max-w-none text-white text-base leading-relaxed prose-pre:p-2 prose-pre:rounded-md prose-pre:bg-black/60 prose-code:text-purple-200 prose-a:text-purple-200 prose-headings:text-white prose-strong:text-white prose-em:text-white/90"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        
        {/* Display images if any */}
        {message.images && message.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {message.images.map((image, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={image} 
                  alt={`Image ${idx + 1}`} 
                  className="rounded-md border border-white/20 max-h-96 w-auto object-contain bg-black/60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <a 
                      href={image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white transition-colors"
                      title="Open image in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                    <a 
                      href={image} 
                      download={`sketchdojo-image-${new Date().getTime()}-${idx}.png`}
                      className="p-1.5 rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white transition-colors"
                      title="Download image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-black/80 border border-purple-700/40 mb-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black border border-purple-600/50">
          <BotIcon className="w-4 h-4 text-purple-300" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex space-x-3 items-center mb-1">
          <div className="text-xs font-medium text-purple-300">SketchDojo</div>
          <div className="text-[10px] text-white/70">Generating</div>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse animation-delay-400"></div>
          <span className="text-sm text-white/80 ml-1">Creating your manga...</span>
        </div>
      </div>
    </div>
  );
} 