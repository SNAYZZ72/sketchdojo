"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Edit, 
  Copy, 
  Star, 
  Clock,
  HelpCircle,
  Shield,
  Wand2,
  Image as ImageIcon, 
  Users,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AIModel, ModelGalleryProps, ModelType } from '@/types/gallery';
import { DEMO_MODELS } from '@/components/constants/gallery';

export const ModelGallery: React.FC<ModelGalleryProps> = ({ viewMode, searchQuery }) => {
  // Filter models based on search query
  const filteredModels = searchQuery 
    ? DEMO_MODELS.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.modelInfo.baseModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : DEMO_MODELS;

  const getModelIcon = (type: ModelType) => {
    switch (type) {
      case 'background':
        return <ImageIcon className="h-4 w-4" />;
      case 'character':
        return <Users className="h-4 w-4" />;
      case 'style':
        return <Palette className="h-4 w-4" />;
      default:
        return <Wand2 className="h-4 w-4" />;
    }
  };

  return (
    <div>
      {filteredModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No models found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or create new models.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-md">
                      {getModelIcon(model.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        {model.name}
                        {model.official && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Shield className="h-3.5 w-3.5 text-primary fill-primary/20" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Official model</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {model.favorite && (
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize">{model.type} Model</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" /> 
                        {model.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Base Model</span>
                    <span className="font-medium">{model.modelInfo.baseModel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Training</span>
                    <span className="font-medium">{model.modelInfo.steps}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-medium">{model.modelInfo.parameters.strength}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 bg-muted/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                </p>
                <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5">
                  <Wand2 className="h-3 w-3" /> Use Model
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredModels.map((model) => (
            <div 
              key={model.id} 
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 h-12 w-12 rounded-md flex items-center justify-center">
                  {getModelIcon(model.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium flex items-center gap-1.5">
                      {model.name}
                      {model.official && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Shield className="h-3.5 w-3.5 text-primary fill-primary/20" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Official model</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {model.favorite && (
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 capitalize">
                      {model.type} Model
                    </span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {model.modelInfo.baseModel}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="h-8 text-xs">
                  <Wand2 className="h-3.5 w-3.5 mr-1" /> Use
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" /> 
                      {model.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 