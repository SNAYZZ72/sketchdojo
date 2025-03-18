// src/components/ai-assistant/ChatInterface.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Mic, StopCircle, Sparkles, Image as ImageIcon, Loader2, Paperclip, XCircle } from 'lucide-react';

// UI Components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// AI Assistant personas
const assistantPersonas = [
  {
    id: 'sensei',
    name: 'Mangaka Sensei',
    role: 'Artistic Mentor',
    description: 'A veteran manga artist with decades of experience, providing technical advice and artistic guidance.',
    avatarUrl: '/assets/assistants/mangaka-sensei.png',
    avatarFallback: 'MS',
    primaryColor: '#FF6B6B',
    secondaryColor: '#FF9E9E',
    welcomeMessage: 'Welcome, aspiring manga creator! I am Mangaka Sensei, and I have guided many artists through their creative journey. My expertise lies in panel composition, visual storytelling, and artistic techniques. How may I assist with your manga today?'
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Story Architect',
    description: 'An imaginative storyteller specializing in narrative structure, character arcs, and plot development.',
    avatarUrl: '/assets/assistants/nova.png',
    avatarFallback: 'NV',
    primaryColor: '#4ECDC4',
    secondaryColor: '#7BE0D6',
    welcomeMessage: 'Greetings! I\'m Nova, your story architect. I specialize in narrative structure, character development, and world-building. Whether you\'re crafting an epic saga or a short story, I\'m here to help shape your manga\'s narrative foundation. What story would you like to explore today?'
  },
  {
    id: 'hiro',
    name: 'Hiro',
    role: 'Technical Expert',
    description: 'A precision-focused specialist in digital tools, effects, and technical aspects of manga creation.',
    avatarUrl: '/assets/assistants/hiro.png',
    avatarFallback: 'HR',
    primaryColor: '#5A67D8',
    secondaryColor: '#7B86E2',
    welcomeMessage: 'Hello! I\'m Hiro, your technical companion for all things manga. I excel at digital tools, panel effects, screen tones, and the technical aspects of manga production. Need help with software features, digital effects, or technical processes? I\'m at your service!'
  },
  {
    id: 'yuki',
    name: 'Yuki',
    role: 'Character Designer',
    description: 'An expressive artist focused on character design, expressions, and personality development.',
    avatarUrl: '/assets/assistants/yuki.png',
    avatarFallback: 'YK',
    primaryColor: '#F9A826',
    secondaryColor: '#FBC26B',
    welcomeMessage: 'Hi there! I\'m Yuki, and I specialize in bringing characters to life! Whether you need help designing appealing characters, crafting distinctive personalities, or drawing expressive poses and emotions, I\'m here to help your characters leap off the page. What character would you like to work on today?'
  }
];

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(assistantPersonas[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add welcome message when persona changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${selectedPersona.id}`,
        role: 'assistant',
        content: selectedPersona.welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [selectedPersona]);

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
    setIsProcessing(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      // Generate persona-specific responses
      let responseContent = '';
      
      switch(selectedPersona.id) {
        case 'sensei':
          responseContent = `I see the potential in your manga concept. Here are some artistic considerations:\n\n1. For this action sequence, consider using dynamic panel angles to enhance the intensity\n2. Your character designs would benefit from more distinctive silhouettes\n3. Try varying your line weights to emphasize depth and focus\n\nWould you like me to elaborate on any of these artistic elements?`;
          break;
        case 'nova':
          responseContent = `Your story concept has intriguing elements! To strengthen your narrative:\n\n1. Consider deepening the protagonist's internal conflict to mirror the external threat\n2. The pacing could be adjusted to build more tension before the revelation\n3. The supporting character's motivation needs a stronger connection to the main plot\n\nWhich aspect of your story would you like to develop further?`;
          break;
        case 'hiro':
          responseContent = `I've analyzed your technical questions. Here's my guidance:\n\n1. For creating that specific effect, layer two screen tones at different angles\n2. The digital coloring would improve with these specific brush settings [detailed parameters]\n3. Your panel borders could be optimized with this technique for better impact\n\nWould you like me to provide step-by-step instructions for any of these techniques?`;
          break;
        case 'yuki':
          responseContent = `Looking at your character concept, I have some suggestions:\n\n1. The facial expressions could show more range by adjusting these specific features\n2. Consider how the character's clothing reflects their personality and background\n3. The character's posture could better communicate their confidence level\n\nShall we work on refining any of these character elements together?`;
          break;
        default:
          responseContent = `I've considered your request carefully. Here are my thoughts:\n\n1. First, we should focus on clarifying the key elements\n2. There are several approaches we could take to enhance this\n3. Consider how these elements work together in your manga\n\nWhich direction would you like to explore further?`;
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
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

  // Change current persona
  const changePersona = (personaId: string) => {
    const persona = assistantPersonas.find(p => p.id === personaId);
    if (persona) {
      setSelectedPersona(persona);
    }
  };

  return (
    <Card 
      className="flex flex-col h-[calc(100vh-12rem)] bg-white/5 backdrop-blur-md dark:bg-white/[0.02] border-white/10 shadow-md"
      style={{ borderColor: `${selectedPersona.primaryColor}20` }}
    >
      <CardHeader className="pb-3 border-b border-white/10" style={{ borderColor: `${selectedPersona.primaryColor}20` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background transition-all duration-300" style={{ borderColor: selectedPersona.primaryColor }}>
              <AvatarImage src={selectedPersona.avatarUrl} />
              <AvatarFallback style={{ backgroundColor: `${selectedPersona.primaryColor}30`, color: selectedPersona.primaryColor }}>
                {selectedPersona.avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {selectedPersona.name}
                <Badge variant="outline" className="text-xs" style={{ backgroundColor: `${selectedPersona.primaryColor}20`, borderColor: `${selectedPersona.primaryColor}30`, color: selectedPersona.primaryColor }}>
                  <Sparkles className="h-3 w-3 mr-1" /> {selectedPersona.role}
                </Badge>
              </CardTitle>
              <p className="text-xs text-white/60">{selectedPersona.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-4 py-2 border-b border-white/10 bg-white/5" style={{ borderColor: `${selectedPersona.primaryColor}20` }}>
        <RadioGroup 
          value={selectedPersona.id} 
          onValueChange={changePersona} 
          className="flex flex-wrap gap-2"
        >
          {assistantPersonas.map(persona => (
            <div key={persona.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={persona.id} 
                id={`persona-${persona.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`persona-${persona.id}`}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 border border-white/10 peer-data-[state=checked]:border-transparent peer-data-[state=checked]:text-white"
                style={{ 
                  backgroundColor: selectedPersona.id === persona.id ? persona.primaryColor : 'transparent',
                  color: selectedPersona.id === persona.id ? 'white' : `${persona.primaryColor}`,
                  borderColor: selectedPersona.id === persona.id ? 'transparent' : `${persona.primaryColor}30`
                }}
              >
                {persona.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' ? (
                    <Avatar className="h-8 w-8" style={{ backgroundColor: `${selectedPersona.primaryColor}20` }}>
                      <AvatarImage src={selectedPersona.avatarUrl} />
                      <AvatarFallback style={{ backgroundColor: `${selectedPersona.primaryColor}30`, color: selectedPersona.primaryColor }}>
                        {selectedPersona.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 bg-secondary/20">
                      <AvatarFallback className="bg-secondary/20 text-secondary">You</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`
                      p-3 rounded-lg text-sm whitespace-pre-wrap
                      ${message.role === 'assistant' 
                        ? 'border text-white' 
                        : 'bg-secondary/10 text-white border border-secondary/20'}
                    `}
                    style={message.role === 'assistant' ? { 
                      backgroundColor: `${selectedPersona.primaryColor}10`,
                      borderColor: `${selectedPersona.primaryColor}30` 
                    } : {}}
                  >
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading indicator when processing */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8" style={{ backgroundColor: `${selectedPersona.primaryColor}20` }}>
                    <AvatarImage src={selectedPersona.avatarUrl} />
                    <AvatarFallback style={{ backgroundColor: `${selectedPersona.primaryColor}30`, color: selectedPersona.primaryColor }}>
                      {selectedPersona.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg border" style={{ 
                    backgroundColor: `${selectedPersona.primaryColor}10`,
                    borderColor: `${selectedPersona.primaryColor}30` 
                  }}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: selectedPersona.primaryColor }} />
                      <span className="text-white/60 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-white/10" style={{ borderColor: `${selectedPersona.primaryColor}20` }}>
        <div className="flex items-end gap-2 w-full">
          <div className="relative flex-1">
            <Textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${selectedPersona.name} about ${selectedPersona.role.toLowerCase()} topics...`}
              className="min-h-12 pr-10 resize-none bg-white/10 border-white/20 text-white placeholder:text-white/40"
              style={{ borderColor: `${selectedPersona.primaryColor}30` }}
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx,.txt"
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
            disabled={isProcessing || (!isRecording && !inputValue.trim())}
            className={`${isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : ''} 
              transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-white h-12 w-12 rounded-full p-0`}
            style={{ 
              background: isRecording ? 'rgb(239, 68, 68)' : `linear-gradient(to right, ${selectedPersona.primaryColor}, ${selectedPersona.secondaryColor})`,
              boxShadow: `0 4px 12px ${selectedPersona.primaryColor}30`
            }}
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
            className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full"
            style={{ borderColor: `${selectedPersona.primaryColor}30` }}
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;