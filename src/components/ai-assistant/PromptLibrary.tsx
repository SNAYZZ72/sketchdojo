// src/components/ai-assistant/PromptLibrary.tsx

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Search, Save, Star, StarOff } from 'lucide-react';

// Sample prompt data
const samplePrompts = [
  {
    id: '1',
    text: 'Help me develop a protagonist with a tragic backstory who still maintains a positive outlook.',
    category: 'Character Development',
    isFavorite: true
  },
  {
    id: '2',
    text: 'Generate a plot twist for a mystery manga where the main suspect is actually protecting the real culprit.',
    category: 'Story Development',
    isFavorite: false
  },
  {
    id: '3',
    text: 'Write dialogue for a tense confrontation between two former friends who are now rivals.',
    category: 'Dialogue',
    isFavorite: true
  },
  {
    id: '4',
    text: 'Suggest panel layouts for an action sequence showing a character using their special ability for the first time.',
    category: 'Panel Design',
    isFavorite: false
  }
];

const PromptLibrary: React.FC = () => {
  const [prompts, setPrompts] = useState(samplePrompts);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPrompts = searchQuery.trim() 
    ? prompts.filter(prompt => 
        prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : prompts;
  
  const toggleFavorite = (id: string) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? {...prompt, isFavorite: !prompt.isFavorite} : prompt
    ));
  };
  
  const usePrompt = (promptText: string) => {
    // This would integrate with the chat interface to add the prompt
    console.log('Using prompt:', promptText);
  };
  
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02]">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input 
              placeholder="Search prompts..." 
              className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[320px] pr-4 -mr-4">
          <div className="space-y-3">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map(prompt => (
                <div 
                  key={prompt.id} 
                  className="p-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary/90">
                      {prompt.category}
                    </span>
                    <button 
                      onClick={() => toggleFavorite(prompt.id)}
                      className="text-white/40 hover:text-yellow-400 transition-colors"
                    >
                      {prompt.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-white/80 mb-3">{prompt.text}</p>
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => usePrompt(prompt.text)}
                      className="text-xs h-8 hover:bg-white/10"
                    >
                      Use Prompt
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-10 w-10 text-white/20 mb-2" />
                <p className="text-sm text-white/60">No prompts found matching '{searchQuery}'</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PromptLibrary;