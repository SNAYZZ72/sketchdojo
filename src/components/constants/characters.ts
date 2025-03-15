// src/components/constants/characters.ts

export interface Character {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    project_id: string | null;
    metadata: CharacterMetadata;
    image_url: string | null;
    training_complete: boolean;
  }
  
  export interface CharacterMetadata {
    gender?: string;
    age?: number | string;
    style?: string;
    hair_color?: string;
    eye_color?: string;
    skin_tone?: string;
    body_type?: string;
    clothing?: string;
    personality?: string[];
    facial_features?: string[];
    pose?: string;
    background?: string;
    accessories?: string[];
    expression?: string;
    additional_details?: string;
    prompt_used?: string;
    negative_prompt?: string;
    generation_params?: any;
  }
  
  // Character style options
  export const characterStyles = [
    { value: 'anime', label: 'Anime' },
    { value: 'manga', label: 'Manga' },
    { value: 'chibi', label: 'Chibi' },
    { value: 'realistic_anime', label: 'Realistic Anime' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'sketch', label: 'Sketch Style' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'cel_shaded', label: 'Cel Shaded' },
  ];
  
  // Gender options
  export const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-Binary' },
    { value: 'other', label: 'Other' },
  ];
  
  // Age range options
  export const ageRangeOptions = [
    { value: 'child', label: 'Child (5-12)' },
    { value: 'teenager', label: 'Teenager (13-19)' },
    { value: 'young_adult', label: 'Young Adult (20-29)' },
    { value: 'adult', label: 'Adult (30-49)' },
    { value: 'older_adult', label: 'Older Adult (50+)' },
  ];
  
  // Hair color options
  export const hairColorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'brown', label: 'Brown' },
    { value: 'blonde', label: 'Blonde' },
    { value: 'red', label: 'Red' },
    { value: 'white', label: 'White/Silver' },
    { value: 'gray', label: 'Gray' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'multicolored', label: 'Multicolored' },
  ];
  
  // Eye color options
  export const eyeColorOptions = [
    { value: 'brown', label: 'Brown' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'hazel', label: 'Hazel' },
    { value: 'gray', label: 'Gray' },
    { value: 'amber', label: 'Amber' },
    { value: 'red', label: 'Red' },
    { value: 'purple', label: 'Purple' },
    { value: 'heterochromia', label: 'Heterochromia (Different Colors)' },
  ];
  
  // Body type options
  export const bodyTypeOptions = [
    { value: 'slim', label: 'Slim' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'muscular', label: 'Muscular' },
    { value: 'average', label: 'Average' },
    { value: 'curvy', label: 'Curvy' },
    { value: 'heavy', label: 'Heavy' },
    { value: 'tall', label: 'Tall' },
    { value: 'short', label: 'Short' },
  ];
  
  // Skin tone options
  export const skinToneOptions = [
    { value: 'fair', label: 'Fair' },
    { value: 'light', label: 'Light' },
    { value: 'medium', label: 'Medium' },
    { value: 'tan', label: 'Tan' },
    { value: 'olive', label: 'Olive' },
    { value: 'brown', label: 'Brown' },
    { value: 'dark', label: 'Dark' },
    { value: 'pale', label: 'Pale' },
  ];
  
  // Clothing style options
  export const clothingOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'school_uniform', label: 'School Uniform' },
    { value: 'business', label: 'Business Attire' },
    { value: 'sporty', label: 'Sporty/Athletic' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'traditional_japanese', label: 'Traditional Japanese' },
    { value: 'futuristic', label: 'Futuristic' },
    { value: 'steampunk', label: 'Steampunk' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'medieval', label: 'Medieval' },
    { value: 'gothic', label: 'Gothic' },
    { value: 'punk', label: 'Punk' },
    { value: 'hipster', label: 'Hipster' },
    { value: 'beachwear', label: 'Beachwear' },
    { value: 'military', label: 'Military' },
    { value: 'superhero', label: 'Superhero' },
  ];
  
  // Personality trait options
  export const personalityTraitOptions = [
    { value: 'kind', label: 'Kind' },
    { value: 'brave', label: 'Brave' },
    { value: 'shy', label: 'Shy' },
    { value: 'confident', label: 'Confident' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm', label: 'Calm' },
    { value: 'intelligent', label: 'Intelligent' },
    { value: 'creative', label: 'Creative' },
    { value: 'serious', label: 'Serious' },
    { value: 'cheerful', label: 'Cheerful' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'adventurous', label: 'Adventurous' },
    { value: 'cautious', label: 'Cautious' },
    { value: 'logical', label: 'Logical' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'determined', label: 'Determined' },
    { value: 'loyal', label: 'Loyal' },
    { value: 'rebellious', label: 'Rebellious' },
    { value: 'mischievous', label: 'Mischievous' },
    { value: 'wise', label: 'Wise' },
    { value: 'innocent', label: 'Innocent' },
    { value: 'suspicious', label: 'Suspicious' },
    { value: 'sarcastic', label: 'Sarcastic' },
    { value: 'caring', label: 'Caring' },
    { value: 'stoic', label: 'Stoic' },
  ];
  
  // Facial feature options
  export const facialFeatureOptions = [
    { value: 'freckles', label: 'Freckles' },
    { value: 'glasses', label: 'Glasses' },
    { value: 'beard', label: 'Beard' },
    { value: 'mustache', label: 'Mustache' },
    { value: 'scar', label: 'Scar' },
    { value: 'mole', label: 'Mole/Beauty Mark' },
    { value: 'sharp_eyes', label: 'Sharp Eyes' },
    { value: 'round_eyes', label: 'Round Eyes' },
    { value: 'monolid', label: 'Monolid' },
    { value: 'double_eyelid', label: 'Double Eyelid' },
    { value: 'thick_eyebrows', label: 'Thick Eyebrows' },
    { value: 'thin_eyebrows', label: 'Thin Eyebrows' },
    { value: 'full_lips', label: 'Full Lips' },
    { value: 'thin_lips', label: 'Thin Lips' },
    { value: 'sharp_jawline', label: 'Sharp Jawline' },
    { value: 'soft_jawline', label: 'Soft Jawline' },
    { value: 'high_cheekbones', label: 'High Cheekbones' },
    { value: 'dimples', label: 'Dimples' },
    { value: 'eye_patch', label: 'Eye Patch' },
    { value: 'tattoo', label: 'Facial Tattoo' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'piercings', label: 'Piercings' },
  ];
  
  // Pose options
  export const poseOptions = [
    { value: 'standing', label: 'Standing' },
    { value: 'sitting', label: 'Sitting' },
    { value: 'action', label: 'Action Pose' },
    { value: 'fighting', label: 'Fighting Stance' },
    { value: 'running', label: 'Running' },
    { value: 'jumping', label: 'Jumping' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'dynamic', label: 'Dynamic' },
    { value: 'portrait', label: 'Portrait (Shoulders Up)' },
    { value: 'full_body', label: 'Full Body' },
    { value: 'three_quarter', label: 'Three-Quarter View' },
    { value: 'profile', label: 'Profile View' },
    { value: 'back_view', label: 'Back View' },
  ];
  
  // Background options
  export const backgroundOptions = [
    { value: 'none', label: 'None/Transparent' },
    { value: 'simple', label: 'Simple Color' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'school', label: 'School' },
    { value: 'city', label: 'City' },
    { value: 'nature', label: 'Nature' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'dojo', label: 'Dojo/Training Hall' },
    { value: 'space', label: 'Space' },
    { value: 'beach', label: 'Beach' },
    { value: 'forest', label: 'Forest' },
    { value: 'mountains', label: 'Mountains' },
    { value: 'castle', label: 'Castle' },
    { value: 'futuristic', label: 'Futuristic Setting' },
    { value: 'traditional_japanese', label: 'Traditional Japanese Setting' },
    { value: 'battlefield', label: 'Battlefield' },
  ];
  
  // Expression options
  export const expressionOptions = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'angry', label: 'Angry' },
    { value: 'surprised', label: 'Surprised' },
    { value: 'afraid', label: 'Afraid' },
    { value: 'disgusted', label: 'Disgusted' },
    { value: 'bored', label: 'Bored' },
    { value: 'excited', label: 'Excited' },
    { value: 'smirk', label: 'Smirk' },
    { value: 'crying', label: 'Crying' },
    { value: 'laughing', label: 'Laughing' },
    { value: 'determined', label: 'Determined' },
    { value: 'confused', label: 'Confused' },
    { value: 'embarrassed', label: 'Embarrassed' },
    { value: 'mischievous', label: 'Mischievous' },
    { value: 'thoughtful', label: 'Thoughtful' },
    { value: 'suspicious', label: 'Suspicious' },
  ];
  
  // Accessory options
  export const accessoryOptions = [
    { value: 'hat', label: 'Hat' },
    { value: 'scarf', label: 'Scarf' },
    { value: 'headphones', label: 'Headphones' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'backpack', label: 'Backpack' },
    { value: 'bag', label: 'Bag/Purse' },
    { value: 'gloves', label: 'Gloves' },
    { value: 'watch', label: 'Watch' },
    { value: 'mask', label: 'Mask' },
    { value: 'glasses', label: 'Glasses' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'weapon', label: 'Weapon' },
    { value: 'shield', label: 'Shield' },
    { value: 'pet', label: 'Pet/Animal Companion' },
    { value: 'technological', label: 'Technological Device' },
    { value: 'belt', label: 'Belt' },
    { value: 'cape', label: 'Cape' },
    { value: 'crown', label: 'Crown/Tiara' },
    { value: 'bandages', label: 'Bandages' },
    { value: 'wings', label: 'Wings' },
    { value: 'tail', label: 'Tail' },
    { value: 'horns', label: 'Horns' },
  ];
  
  // Quality presets
  export const qualityPresets = [
    { value: 'draft', label: 'Draft (Quick)', description: 'Generates quickly with basic detail' },
    { value: 'standard', label: 'Standard', description: 'Balanced quality and generation time' },
    { value: 'high', label: 'High Quality', description: 'Detailed output with longer generation time' },
  ];
  
  // Guidance settings
  export const guidanceSettings = [
    { value: 1, label: 'Very Creative', description: 'More stylistic freedom but less predictable' },
    { value: 7, label: 'Balanced', description: 'Good balance between creativity and adherence to prompt' },
    { value: 15, label: 'Very Precise', description: 'Closely follows your prompt but less creative variation' },
  ];
  
  // Generation parameters
  export const defaultGenerationParams = {
    width: 512,
    height: 768,
    guidance_scale: 7,
    num_inference_steps: 30,
    seed: null, // Random seed
    negative_prompt: "nsfw, nude, bad anatomy, deformed, cropped, low quality, pixelated, bad composition"
  };
  
  // Character generator tabs
  export const characterGeneratorTabs = [
    { id: 'basic', label: 'Basic Details' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'personality', label: 'Personality' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  // Character export formats
  export const characterExportFormats = [
    { value: 'png', label: 'PNG Image' },
    { value: 'transparent_png', label: 'Transparent PNG' },
    { value: 'character_sheet', label: 'Character Sheet (PDF)' },
    { value: 'json', label: 'Character Data (JSON)' }
  ];
  
  // Character aspect ratios
  export const characterAspectRatios = [
    { value: 'portrait', label: 'Portrait (3:4)', width: 768, height: 1024 },
    { value: 'square', label: 'Square (1:1)', width: 768, height: 768 },
    { value: 'landscape', label: 'Landscape (4:3)', width: 1024, height: 768 },
    { value: 'widescreen', label: 'Widescreen (16:9)', width: 1024, height: 576 },
  ];