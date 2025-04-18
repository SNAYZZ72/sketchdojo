'use client';

class StabilityService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY || '';
    this.apiUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
  }

  async generateImage(prompt: string): Promise<string | null> {
    if (!this.apiKey) {
      console.error('Missing Stability API key');
      return null;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `manga panel, ${prompt}, detailed manga style, black and white, high contrast, line art, shounen style`,
              weight: 1,
            },
            {
              text: 'low quality, blurry, worst quality, low resolution, ugly, duplicate, deformed, extra limbs',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          // Allowed dimensions for SDXL: 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, 896x1152
          height: 1216,
          width: 832,
          samples: 1,
          steps: 30,
          style_preset: 'anime',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Stability API error:', error);
        return null;
      }

      const result = await response.json();
      
      // Extract base64 image from the result
      if (result.artifacts && result.artifacts.length > 0) {
        const base64Image = result.artifacts[0].base64;
        return `data:image/png;base64,${base64Image}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating image with Stability AI:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const stabilityService = new StabilityService(); 