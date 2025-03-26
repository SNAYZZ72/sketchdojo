import { Asset, AIModel } from '@/types/gallery';

// Asset type options
export const ASSET_TYPES = [
  { value: 'background', label: 'Background', description: 'Environments and scenes' },
  { value: 'character', label: 'Character', description: 'Character designs and portraits' },
  { value: 'scene', label: 'Scene', description: 'Complete manga panels and scenes' },
  { value: 'other', label: 'Other', description: 'Other types of assets' },
];

// Model type options
export const MODEL_TYPES = [
  { value: 'character', label: 'Character Model', description: 'For generating characters' },
  { value: 'style', label: 'Style Model', description: 'For applying art styles' },
  { value: 'background', label: 'Background Model', description: 'For generating backgrounds' },
  { value: 'other', label: 'Other Model', description: 'Other types of models' },
];

// Base models available in the system
export const BASE_MODELS = [
  { value: 'SD-XL 1.0', label: 'SD-XL 1.0', description: 'Latest Stable Diffusion XL model' },
  { value: 'SD-XL 0.9', label: 'SD-XL 0.9', description: 'Previous Stable Diffusion XL model' },
  { value: 'SD 1.5', label: 'SD 1.5', description: 'Stable Diffusion 1.5' },
  { value: 'SD 2.1', label: 'SD 2.1', description: 'Stable Diffusion 2.1' },
];

// Sort options for gallery items
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
  { value: 'favorites', label: 'Favorites First' },
];

// Filter options
export const FILTER_OPTIONS = {
  assets: [
    { value: 'all', label: 'All Assets' },
    { value: 'background', label: 'Backgrounds' },
    { value: 'character', label: 'Characters' },
    { value: 'scene', label: 'Scenes' },
    { value: 'favorites', label: 'Favorites' },
  ],
  models: [
    { value: 'all', label: 'All Models' },
    { value: 'character', label: 'Character Models' },
    { value: 'style', label: 'Style Models' },
    { value: 'background', label: 'Background Models' },
    { value: 'official', label: 'Official Models' },
    { value: 'favorites', label: 'Favorites' },
  ],
};

// Demo assets for development
export const DEMO_ASSETS: Asset[] = [
  {
    id: 'bg-1',
    name: 'Night City Background',
    type: 'background',
    imageUrl: 'https://picsum.photos/seed/bg1/600/400',
    createdAt: new Date('2023-03-15'),
    favorite: true,
    tags: ['city', 'night', 'cyberpunk'],
  },
  {
    id: 'char-1',
    name: 'Hero Character',
    type: 'character',
    imageUrl: 'https://picsum.photos/seed/char1/600/400',
    createdAt: new Date('2023-03-18'),
    favorite: false,
    tags: ['hero', 'protagonist', 'male'],
  },
  {
    id: 'scene-1',
    name: 'Battle Scene',
    type: 'scene',
    imageUrl: 'https://picsum.photos/seed/scene1/600/400',
    createdAt: new Date('2023-03-20'),
    favorite: true,
    tags: ['action', 'battle', 'dramatic'],
  },
  {
    id: 'bg-2',
    name: 'Forest Background',
    type: 'background',
    imageUrl: 'https://picsum.photos/seed/bg2/600/400',
    createdAt: new Date('2023-03-22'),
    favorite: false,
    tags: ['nature', 'forest', 'peaceful'],
  },
  {
    id: 'char-2',
    name: 'Villain Character',
    type: 'character',
    imageUrl: 'https://picsum.photos/seed/char2/600/400',
    createdAt: new Date('2023-03-25'),
    favorite: false,
    tags: ['villain', 'antagonist', 'dark'],
  },
  {
    id: 'scene-2',
    name: 'Peaceful Scene',
    type: 'scene',
    imageUrl: 'https://picsum.photos/seed/scene2/600/400',
    createdAt: new Date('2023-03-27'),
    favorite: true,
    tags: ['peace', 'quiet', 'emotional'],
  },
];

// Demo models for development
export const DEMO_MODELS: AIModel[] = [
  {
    id: 'model-1',
    name: 'Anime Character Generator',
    type: 'character',
    modelInfo: {
      steps: '1000 steps',
      baseModel: 'SD-XL 1.0',
      parameters: {
        strength: 0.8,
        guidance: 7.5
      }
    },
    createdAt: new Date('2023-03-15'),
    favorite: true,
    official: false,
    tags: ['anime', 'character', 'generator'],
  },
  {
    id: 'model-2',
    name: 'Cyberpunk Style',
    type: 'style',
    modelInfo: {
      steps: '1500 steps',
      baseModel: 'SD-XL 0.9',
      parameters: {
        strength: 0.9,
        guidance: 8.0
      }
    },
    createdAt: new Date('2023-03-18'),
    favorite: false,
    official: true,
    tags: ['cyberpunk', 'style', 'sci-fi'],
  },
  {
    id: 'model-3',
    name: 'Fantasy Backgrounds',
    type: 'background',
    modelInfo: {
      steps: '800 steps',
      baseModel: 'SD 1.5',
      parameters: {
        strength: 0.7,
        guidance: 7.0
      }
    },
    createdAt: new Date('2023-03-20'),
    favorite: true,
    official: false,
    tags: ['fantasy', 'background', 'medieval'],
  },
  {
    id: 'model-4',
    name: 'Manga Style',
    type: 'style',
    modelInfo: {
      steps: '1200 steps',
      baseModel: 'SD-XL 1.0',
      parameters: {
        strength: 0.85,
        guidance: 7.8
      }
    },
    createdAt: new Date('2023-03-22'),
    favorite: false,
    official: true,
    tags: ['manga', 'style', 'black and white'],
  },
  {
    id: 'model-5',
    name: 'Advanced Character Generator',
    type: 'character',
    modelInfo: {
      steps: '2000 steps',
      baseModel: 'SD-XL 1.0',
      parameters: {
        strength: 0.95,
        guidance: 8.5
      }
    },
    createdAt: new Date('2023-03-25'),
    favorite: false,
    official: false,
    tags: ['advanced', 'character', 'detailed'],
  },
]; 