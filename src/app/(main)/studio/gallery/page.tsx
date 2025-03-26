"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Image as ImageIcon, 
  Users, 
  Layers, 
  Film, 
  Sparkles, 
  Search,
  Palette,
  ArrowDownUp,
  Grid3X3
} from 'lucide-react';
import { AssetGallery, ModelGallery } from '@/components/gallery';

const GalleryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage and browse your creations and AI models</p>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets and models..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('grid')}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('list')}
              title="List view"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <ImageIcon className="h-6 w-6 text-primary" />
                <span>Backgrounds</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Users className="h-6 w-6 text-primary" />
                <span>Characters</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Film className="h-6 w-6 text-primary" />
                <span>Scenes</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Layers className="h-6 w-6 text-primary" />
                <span>All Assets</span>
              </Button>
            </div>
            
            <AssetGallery viewMode={view} searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Sparkles className="h-6 w-6 text-primary" />
                <span>Character Models</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Palette className="h-6 w-6 text-primary" />
                <span>Style Models</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <ImageIcon className="h-6 w-6 text-primary" />
                <span>Background Models</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/5">
                <Layers className="h-6 w-6 text-primary" />
                <span>All Models</span>
              </Button>
            </div>
            
            <ModelGallery viewMode={view} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GalleryPage; 