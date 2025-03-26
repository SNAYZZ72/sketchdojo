// Asset Types
export type AssetType = 'background' | 'character' | 'scene' | 'other';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  imageUrl: string;
  createdAt: Date;
  favorite: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Model Types
export type ModelType = 'character' | 'style' | 'background' | 'other';

export interface ModelParameters {
  strength: number;
  guidance: number;
  [key: string]: any;
}

export interface ModelInfo {
  steps: string;
  baseModel: string;
  parameters: ModelParameters;
}

export interface AIModel {
  id: string;
  name: string;
  type: ModelType;
  modelInfo: ModelInfo;
  createdAt: Date;
  favorite: boolean;
  official: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Gallery Component Props
export interface GalleryViewProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

export interface AssetGalleryProps extends GalleryViewProps {}

export interface ModelGalleryProps extends GalleryViewProps {} 