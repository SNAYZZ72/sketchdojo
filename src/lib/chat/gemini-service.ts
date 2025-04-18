'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private ai: GoogleGenerativeAI;
  private model: string;
  private imageGenerationModel: string;

  /**
   * Enhance a user prompt by asking Gemini to rewrite it with vivid manga/anime visual detail.
   * Returns the enhanced prompt as a string.
   */
  async enhancePrompt(prompt: string): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: this.model });
      const enhancementInstruction = `Rewrite the following prompt for a manga or anime scene, making it more vivid, visually descriptive, and detailed. Add style, lighting, dynamic composition, and emotional cues, but keep it concise and suitable for an AI image generator.\nPrompt: ${prompt}`;
      const result = await model.generateContent(enhancementInstruction);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error enhancing prompt with Gemini:', error);
      // If the enhancement fails, just return the original prompt
      return prompt;
    }
  }

  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
    this.model = 'gemini-1.5-pro';
    this.imageGenerationModel = 'gemini-1.5-pro-vision'; // Use vision model as fallback
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response from Gemini:', error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      // Since Gemini doesn't directly support image generation through their JS SDK,
      // we'll use a placeholder image for now. In a real app, you would integrate with
      // the Stability AI API for actual image generation.
      const placeholderImageUrl = `https://placehold.co/600x800/png?text=${encodeURIComponent('Manga: ' + prompt.slice(0, 30))}`;
      
      // Return placeholder image
      return placeholderImageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService(); 