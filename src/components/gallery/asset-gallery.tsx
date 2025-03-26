"use client";

import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Edit, 
  Copy, 
  Star, 
  Clock,
  Image as ImageIcon, 
  Users,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Asset, AssetGalleryProps, AssetType } from '@/types/gallery';
import { DEMO_ASSETS } from '@/components/constants/gallery';

export const AssetGallery: React.FC<AssetGalleryProps> = ({ viewMode, searchQuery }) => {
  // Filter assets based on search query
  const filteredAssets = searchQuery 
    ? DEMO_ASSETS.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : DEMO_ASSETS;

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'background':
        return <ImageIcon className="h-4 w-4" />;
      case 'character':
        return <Users className="h-4 w-4" />;
      case 'scene':
        return <Film className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  return (
    <div>
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No assets found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or create new assets.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden group">
              <CardContent className="p-0 relative aspect-video">
                <Image
                  src={asset.imageUrl}
                  alt={asset.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {asset.favorite && (
                  <div className="absolute top-2 right-2 bg-background/80 p-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1 rounded-md">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(asset.createdAt, { addSuffix: true })}
                    </p>
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
                      {asset.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={asset.imageUrl}
                    alt={asset.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{asset.name}</h3>
                    {asset.favorite && (
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {getAssetIcon(asset.type)} {asset.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(asset.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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
                    {asset.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 