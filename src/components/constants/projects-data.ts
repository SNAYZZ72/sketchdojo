import { Chat } from '@/providers/chat-provider';
import { storageService, STORAGE_KEYS } from '@/lib/storage-service';

// Project interface extends Chat with additional project-specific fields
export interface Project extends Chat {
  imageUrl: string;   // Will use the first image from messages if available
  type?: string;      // Can be derived from chat content or title
  featured?: boolean; // Featured projects to highlight
  href: string;       // Link to the chat page
  lastEdited: string; // Formatted date string of when the project was last edited
}

// Function to convert Chat objects to Project objects
export function chatToProject(chat: Chat): Project {
  // Find the first image in the chat messages to use as the project image
  let imageUrl = '';
  for (const message of chat.messages) {
    if (message.images && message.images.length > 0) {
      imageUrl = message.images[0];
      break;
    }
  }

  // Default image if none found
  if (!imageUrl) {
    imageUrl = '/images/placeholder-project.jpg';
  }

  // Derive project type from title (example implementation)
  let type: string | undefined;
  const lcTitle = chat.title.toLowerCase();
  if (lcTitle.includes('action') || lcTitle.includes('shounen')) {
    type = 'action';
  } else if (lcTitle.includes('romance') || lcTitle.includes('shoujo')) {
    type = 'romance';
  } else if (lcTitle.includes('horror') || lcTitle.includes('dark')) {
    type = 'dark fantasy';
  } else if (lcTitle.includes('comedy') || lcTitle.includes('humor')) {
    type = 'comedy';
  }

  // Format last edited time
  const lastEdited = new Date(chat.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    ...chat,
    imageUrl,
    type,
    featured: false, // You can set criteria for featured projects
    href: `/studio/chat/${chat.id}`,
    lastEdited
  };
}

// Function to get all projects from storage
export function getProjects(): Project[] {
  const chats = storageService.getItem<Chat[]>(STORAGE_KEYS.CHATS, true);
  if (!chats || !Array.isArray(chats)) {
    return [];
  }
  
  return chats.map(chatToProject);
}

// Sample data for testing/fallback when no projects exist
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-1',
    title: 'Cyberpunk Ninjas',
    messages: [],
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
    imageUrl: '/images/sample-projects/cyberpunk.jpg',
    type: 'action',
    featured: true,
    href: '/studio/chat/sample-1',
    lastEdited: '1 day ago'
  },
  {
    id: 'sample-2',
    title: 'High School Romance',
    messages: [],
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
    imageUrl: '/images/sample-projects/romance.jpg',
    type: 'romance',
    featured: false,
    href: '/studio/chat/sample-2',
    lastEdited: '2 days ago'
  },
  {
    id: 'sample-3',
    title: 'Ancient Demons',
    messages: [],
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    updatedAt: Date.now() - 86400000 * 3, // 3 days ago
    imageUrl: '/images/sample-projects/dark-fantasy.jpg',
    type: 'dark fantasy',
    featured: true,
    href: '/studio/chat/sample-3',
    lastEdited: '3 days ago'
  },
  {
    id: 'sample-4',
    title: 'Slice of Life Comedy',
    messages: [],
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    updatedAt: Date.now() - 86400000 * 4, // 4 days ago
    imageUrl: '/images/sample-projects/comedy.jpg',
    type: 'comedy',
    featured: false,
    href: '/studio/chat/sample-4',
    lastEdited: '4 days ago'
  },
]; 