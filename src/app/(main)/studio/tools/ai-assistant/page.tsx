// src/app/(main)/studio/tools/ai-assistant/page.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/global/protected-route';

// Components
import ChatInterface from '@/components/ai-assistant/ChatInterface';
import ContextPanel from '@/components/ai-assistant/ContextPanel';
import PromptLibrary from '@/components/ai-assistant/PromptLibrary';

// Icons
import { Bot, ZapIcon, MessageCircle, Book, Settings, Sparkles } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  }
];

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<string>('context');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState(assistantPersonas[0]);
  const supabase = createClient();

  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Panel - Context and Settings */}
          <motion.div 
            className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Manga Mind <Badge variant="outline" className="text-xs ml-2 bg-primary/10 border-primary/20 text-primary">AI</Badge>
              </h1>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary hover:text-primary transition-colors duration-300"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="context" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="context">Context</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="context" className="mt-4">
                <ContextPanel activePersona={selectedPersona} />
              </TabsContent>
              
              <TabsContent value="prompts" className="mt-4">
                <PromptLibrary />
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02]">
                  <CardContent className="space-y-4 p-4">
                    <p className="text-sm text-white/60">Your conversation history will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          {/* Right Panel - Chat Interface */}
          <motion.div 
            className="w-full md:w-2/3 lg:w-3/4 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ChatInterface />
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}