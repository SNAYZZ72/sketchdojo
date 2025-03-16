// Common constants for both background and character generators

export const qualityPresets = [
    {
      value: 'draft',
      label: 'Draft',
      description: 'Faster generation with lower quality. Good for experimentation.'
    },
    {
      value: 'standard',
      label: 'Standard',
      description: 'Balanced quality and generation time. Recommended for most use cases.'
    },
    {
      value: 'high',
      label: 'High Quality',
      description: 'Enhanced detail and visual fidelity. Takes longer to generate.'
    }
  ];
  
  export const guidanceSettings = [
    { value: 3, label: 'More Creative', description: 'Less adherence to prompt, more creative freedom' },
    { value: 7, label: 'Balanced', description: 'Standard guidance, balanced between creativity and precision' },
    { value: 12, label: 'More Precise', description: 'Stricter adherence to prompt, less creative freedom' }
  ];
  
  export const defaultGenerationParams = {
    num_inference_steps: 30,
    guidance_scale: 7,
    width: 1024,
    height: 1024,
    negative_prompt: 'deformed, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, watermark, distorted, crop, out of frame'
  };
  
  export interface CommonFormState {
    name: string;
    description: string;
    projectId: string | null;
  }
  
  export interface GenerationParams {
    num_inference_steps: number;
    guidance_scale: number;
    width: number;
    height: number;
    negative_prompt: string;
    seed?: number;
  }
  
  export interface GeneratorTab {
    id: string;
    label: string;
    icon?: string;
  }