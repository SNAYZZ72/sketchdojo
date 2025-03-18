import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Mic, StopCircle, Sparkles, Image as ImageIcon, Loader2, Paperclip } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CoverChatInterfaceProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export default function CoverChatInterface({ 
  onGenerate, 
  isGenerating 
}: CoverChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'm your Cover Design Assistant. I can help you create the perfect manga cover based on your description. What kind of cover would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can create a cover based on your "${inputValue}" request. Would you like me to generate this now, or would you like to provide more details about the style, mood, or elements you want to include?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Add suggestion buttons message
      const suggestionsMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '**options**',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, suggestionsMessage]);
    }, 1000);
  };
  
  const handleGenerate = async () => {
    // Find the last user message to use as the prompt
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      const generatingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm generating your cover now. This might take a moment...",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, generatingMessage]);
      
      // Call the onGenerate function passed from parent
      await onGenerate(lastUserMessage.content);
      
      // Add completion message
      const completionMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've created a cover based on your description. You can see it in the preview panel. Feel free to make adjustments or ask for specific changes.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completionMessage]);
    }
  };
  
  const handleSuggestion = (suggestion: string) => {
    // Add suggestion as user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: suggestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Great choice! I'll ${suggestion.toLowerCase()}. Is there anything specific you'd like me to focus on?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 800);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] h-[500px] flex flex-col">
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => {
                // Special message for suggestions
                if (message.content === '**options**') {
                  return (
                    <div key={message.id} className="flex justify-start">
                      <div className="flex flex-wrap gap-2 max-w-[80%]">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-primary/10 border-primary/20 text-white hover:bg-primary/20"
                          onClick={() => handleGenerate()}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-2" />
                              Generate Now
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => handleSuggestion("Add more details to the design")}
                        >
                          Add more details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => handleSuggestion("Try a different style")}
                        >
                          Try different style
                        </Button>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {message.role === 'assistant' ? (
                        <Avatar className="h-8 w-8 bg-primary/20">
                          <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 bg-secondary/20">
                          <AvatarFallback className="bg-secondary/20 text-secondary">You</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`
                          p-3 rounded-lg text-sm
                          ${message.role === 'assistant' 
                            ? 'bg-primary/10 text-white border border-primary/30' 
                            : 'bg-secondary/10 text-white border border-secondary/20'}
                        `}
                      >
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-white/10">
            <div className="flex items-end gap-2 w-full">
              <div className="relative flex-1">
                <Textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your ideal manga cover..."
                  className="min-h-12 pr-10 resize-none bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={triggerFileUpload}
                  className="absolute right-2 bottom-2 p-1 rounded-md text-white/40 hover:text-white/70 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
              
              <Button 
                onClick={isRecording ? handleVoiceInput : handleSendMessage}
                disabled={isGenerating || (!isRecording && !inputValue.trim())}
                className={`${isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary hover:bg-primary-dark'} 
                  transition-all duration-300 transform hover:-translate-y-0.5 h-10 w-10 rounded-full p-0`}
              >
                {isRecording ? (
                  <StopCircle className="h-5 w-5" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleVoiceInput}
                className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 h-10 w-10 rounded-full"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}