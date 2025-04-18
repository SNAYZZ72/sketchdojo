'use client';
import { Chat } from '../types/chat';

/**
 * StorageService - A service for handling localStorage operations
 * with error handling and type safety
 */
class StorageService {
  /**
   * Set an item in localStorage with error handling
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      
      // First try to set the item normally
      try {
        localStorage.setItem(key, serialized);
        console.log(`StorageService: Saved ${key} to localStorage`);
        return true;
      } catch (error) {
        // If we hit quota, try cleaning up old data
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, attempting cleanup...');
          
          // Get all chat data
          const chats = this.getItem<Chat[]>(STORAGE_KEYS.CHATS);
          if (Array.isArray(chats) && chats.length > 5) {
            // Sort by oldest first and remove 20% of oldest chats
            const sorted = [...chats].sort((a, b) => a.updatedAt - b.updatedAt);
            const toKeep = Math.floor(sorted.length * 0.8);
            const cleanedChats = sorted.slice(-toKeep);
            
            // Try saving again with cleaned data
            try {
              localStorage.setItem(key, JSON.stringify(cleanedChats));
              console.log('Successfully saved after cleanup');
              return true;
            } catch (cleanupError) {
              console.error('Still failed after cleanup:', cleanupError);
              return false;
            }
          }
        }
        
        console.error(`StorageService: Error saving ${key} to localStorage:`, error);
        return false;
      }
    } catch (error) {
      console.error(`StorageService: Unexpected error in setItem:`, error);
      return false;
    }
  }

  /**
   * Get an item from localStorage with error handling
   * and optional automatic parsing of JSON data
   */
  getItem<T>(key: string, parse: boolean = true): T | string | null {
    try {
      const value = localStorage.getItem(key);
      
      if (value === null) {
        return null;
      }
      
      if (parse) {
        try {
          return JSON.parse(value) as T;
        } catch {
          // If parsing fails, return the value as is
          return value;
        }
      }
      
      return value;
    } catch (error) {
      console.error(`StorageService: Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage with error handling
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      console.log(`StorageService: Removed ${key} from localStorage`);
      return true;
    } catch (error) {
      console.error(`StorageService: Error removing ${key} from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage with error handling
   */
  clear(): boolean {
    try {
      localStorage.clear();
      console.log("StorageService: Cleared localStorage");
      return true;
    } catch (error) {
      console.error("StorageService: Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   */
  keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error("StorageService: Error getting keys from localStorage:", error);
      return [];
    }
  }
}

// Constants for consistent localStorage keys
export const STORAGE_KEYS = {
  INITIAL_PROMPT: 'sketchdojo-initial-prompt',
  CHATS: 'sketchdojo-chats',
  INITIAL_CHAT_ID: 'sketchdojo-initial-chat-id'
} as const;

// Export a singleton instance of the service
export const storageService = new StorageService();