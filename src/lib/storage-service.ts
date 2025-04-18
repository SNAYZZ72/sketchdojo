'use client';

/**
 * StorageService - A service for handling localStorage operations
 * with error handling and type safety
 */
class StorageService {
  /**
   * Set an item in localStorage with error handling
   */
  setItem<T>(key: string, value: T): boolean { // Changed from 'any' to '<T>'
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      console.log(`StorageService: Saved ${key} to localStorage`);
      return true;
    } catch (error) {
      console.error(`StorageService: Error saving ${key} to localStorage:`, error);
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
  INITIAL_PROMPT: 'initial_prompt',
  CHATS: 'sketchdojo-chats',
};

// Export a singleton instance of the service
export const storageService = new StorageService(); 