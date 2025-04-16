"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Download,
  Star,
  Copy,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Image from 'next/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Services & Types
import { Character } from '@/types/projects';
import { characterService } from '@/services/api';

// Loading UI component
const LoadingState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-12">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Users className="h-6 w-6 text-primary/50" />
      </div>
    </div>
    <span className="mt-4 text-white/70">Loading characters...</span>
  </div>
);

// Empty state component
const EmptyState = ({ onCreateClick }: { onCreateClick: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
      <Users className="h-10 w-10 text-white/30" />
    </div>
    <h3 className="text-xl font-medium text-white mb-2">No characters yet</h3>
    <p className="text-white/60 max-w-md mb-6">
      Characters help you build consistent narratives across your manga. Create your first character to get started.
    </p>
    <Button 
      className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:shadow-lg hover:shadow-sketchdojo-primary/30 text-white transition-all duration-300 border-0"
      onClick={onCreateClick}
    >
      <Plus className="h-4 w-4 mr-2" /> Create First Character
    </Button>
  </div>
);

// Character card component
interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

const CharacterCard = ({ character, onClick }: CharacterCardProps) => {
  // Extract metadata with proper type checking
  const metadata = character.metadata || {};
  const age = typeof metadata.age === 'string' ? metadata.age : '';
  const gender = typeof metadata.gender === 'string' ? metadata.gender : '';
  const role = typeof metadata.role === 'string' ? metadata.role : '';
  const personality = Array.isArray(metadata.personality) ? metadata.personality : [];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/5 hover:border-sketchdojo-primary/30">
        <div className="h-52 bg-black/30 relative overflow-hidden">
          {character.image_url ? (
            <Image 
              src={character.image_url} 
              alt={character.name}
              width={400}
              height={600}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sketchdojo-bg-light to-sketchdojo-bg">
              <div className="relative">
                <div className="absolute -inset-8 bg-sketchdojo-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Users className="h-16 w-16 text-white/20 relative" />
              </div>
            </div>
          )}
          
          {/* Character role badge */}
          {role && (
            <Badge className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white border-0">
              {role}
            </Badge>
          )}
          
          {/* Character actions */}
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-sketchdojo-bg-light/95 backdrop-blur-md border-white/10 text-white">
                <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10 cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> Edit Character
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10 cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10 cursor-pointer">
                  <Download className="h-4 w-4 mr-2" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:text-white hover:bg-white/10 cursor-pointer">
                  <Star className="h-4 w-4 mr-2" /> Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Overlaid gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-white group-hover:text-sketchdojo-primary transition-colors">{character.name}</h3>
          {gender && age && (
            <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
              <span>{gender}</span>
              <span className="h-1 w-1 rounded-full bg-white/30"></span>
              <span>{age} years old</span>
            </div>
          )}
          <p className="mt-2 text-sm text-white/70 line-clamp-2">
            {character.description || "No description available"}
          </p>
          
          {/* Character attributes/personality tags */}
          {personality.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {personality.slice(0, 3).map((trait, index) => (
                <Badge key={index} variant="outline" className="bg-white/5 text-white/80 border-white/10 text-xs">
                  {trait}
                </Badge>
              ))}
              {personality.length > 3 && (
                <Badge variant="outline" className="bg-white/5 text-white/80 border-white/10 text-xs">
                  +{personality.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs px-2"
          >
            Preview
          </Button>
          <Button 
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3"
            onClick={() => onClick(character)}
          >
            <ArrowUpRight className="h-3 w-3 mr-1" /> Open
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Create character card component
const CreateCharacterCard = ({ onClick }: { onClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Card 
      className="border border-dashed border-white/20 bg-white/[0.01] backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 hover:border-sketchdojo-primary/30 cursor-pointer overflow-hidden h-full"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center h-full">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-300">
          <Plus className="h-8 w-8 text-white/40 group-hover:text-white transition-colors duration-300" />
          <div className="absolute inset-0 rounded-full bg-sketchdojo-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Create New Character</h3>
        <p className="text-white/60 mb-4">Add a new character to your manga project</p>
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Character
        </Button>
      </div>
    </Card>
  </motion.div>
);

// Main Characters Tab component
interface CharactersTabProps {
  projectId: string;
}

export function CharactersTab({ projectId }: CharactersTabProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Fetch characters or use mocks
  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const response = await characterService.getCharacters(projectId);
        if (response.success && response.data) {
          setCharacters(response.data);
        } else {
          throw new Error("Failed to load characters");
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        
        // For demo purposes, use mock data
        const mockCharacters: Character[] = [
          {
            id: '1',
            project_id: projectId,
            name: 'Hikaru Yamada',
            description: 'A high school student with mysterious psychic abilities that emerged after a traumatic accident.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: null,
            metadata: {
              age: '17',
              gender: 'Male',
              role: 'Protagonist',
              personality: ['Quiet', 'Determined', 'Compassionate', 'Introspective']
            },
            user_id: '123'
          },
          {
            id: '2',
            project_id: projectId,
            name: 'Mizuki Tanaka',
            description: 'Brilliant hacker and tech prodigy who becomes Hikaru\'s closest ally in understanding his powers.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: null,
            metadata: {
              age: '16',
              gender: 'Female',
              role: 'Supporting',
              personality: ['Energetic', 'Genius', 'Loyal', 'Eccentric']
            },
            user_id: '123'
          },
          {
            id: '3',
            project_id: projectId,
            name: 'Dr. Kenji Sato',
            description: 'Brilliant scientist researching psychic phenomena who takes interest in Hikaru\'s abilities.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: null,
            metadata: {
              age: '45',
              gender: 'Male',
              role: 'Supporting',
              personality: ['Analytical', 'Dedicated', 'Secretive']
            },
            user_id: '123'
          },
          {
            id: '4',
            project_id: projectId,
            name: 'Ryota Nakamura',
            description: 'Government agent hunting psychics for a classified program; becomes Hikaru\'s primary antagonist.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: null,
            metadata: {
              age: '38',
              gender: 'Male',
              role: 'Antagonist',
              personality: ['Ruthless', 'Calculated', 'Dedicated', 'Complicated']
            },
            user_id: '123'
          }
        ];
        setCharacters(mockCharacters);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCharacters();
  }, [projectId]);
  
  // Filter characters based on search and role
  useEffect(() => {
    let result = characters;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(char => {
        const metadata = char.metadata || {};
        const personalityString = Array.isArray(metadata.personality) 
          ? metadata.personality.join(' ').toLowerCase() 
          : '';
          
        return (
          char.name.toLowerCase().includes(query) ||
          (char.description?.toLowerCase().includes(query) || false) ||
          (metadata.role?.toLowerCase().includes(query) || false) ||
          personalityString.includes(query)
        );
      });
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter(char => {
        const role = char.metadata?.role?.toLowerCase() || '';
        return role === filterRole.toLowerCase();
      });
    }
    
    setFilteredCharacters(result);
  }, [characters, searchQuery, filterRole]);
  
  const handleCreateCharacter = () => {
    // This would open a character creation modal/form
    toast.info("Character creation form would open here", {
      description: "This functionality is not implemented in the demo"
    });
  };
  
  const handleSelectCharacter = (character: Character) => {
    // This would open the character details/edit view
    toast.info(`Selected character: ${character.name}`, {
      description: "Character detail view would open here"
    });
  };
  
  // Get unique roles for filtering
  const roles = ['all', ...new Set(characters.map(char => 
    (char.metadata?.role?.toLowerCase() || '')
  ).filter(Boolean))];
  
  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show empty state if no characters
  if (characters.length === 0) {
    return <EmptyState onCreateClick={handleCreateCharacter} />;
  }
  
  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and create button */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Characters</h2>
            <p className="text-white/60 mt-1">Manage the characters in your manga project</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:shadow-lg hover:shadow-sketchdojo-primary/30 text-white transition-all duration-300 border-0 self-start"
            onClick={handleCreateCharacter}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Character
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-sketchdojo-primary/30"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Tabs 
                  value={filterRole} 
                  onValueChange={setFilterRole}
                  className="w-full md:w-auto"
                >
                  <TabsList className="bg-white/5 p-1 w-full md:w-auto">
                    {roles.map(role => (
                      <TabsTrigger 
                        key={role} 
                        value={role}
                        className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                Filter by character role
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Show message when no results match filters */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No characters found</h3>
            <p className="text-white/60 mb-4">No characters match your current filters</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setFilterRole('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Character grid */}
        {filteredCharacters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map(character => (
              <CharacterCard 
                key={character.id} 
                character={character} 
                onClick={handleSelectCharacter} 
              />
            ))}
            
            {/* Add new character card */}
            <CreateCharacterCard onClick={handleCreateCharacter} />
          </div>
        )}
      </div>
    </div>
  );
}