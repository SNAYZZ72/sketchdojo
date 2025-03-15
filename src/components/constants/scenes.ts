// src/components/constants/scenes.ts

export interface Scene {
    id: string;
    title: string;
    description: string | null;
    project_id: string | null;
    created_at: string;
    updated_at: string;
    user_id: string;
    metadata: SceneMetadata;
    image_url: string | null;
  }
  
  export interface SceneMetadata {
    panel_layout?: string;
    style?: string;
    scene_type?: string;
    camera_angle?: string;
    perspective?: string;
    time_of_day?: string;
    lighting?: string;
    weather?: string;
    environment?: string;
    mood?: string;
    action?: string;
    characters?: SceneCharacter[];
    effects?: string[];
    dialog?: SceneDialog[];
    composition?: string;
    prompt_used?: string;
    negative_prompt?: string;
    generation_params?: any;
  }
  
  export interface SceneCharacter {
    id?: string;
    name?: string;
    position?: string;
    pose?: string;
    expression?: string;
    action?: string;
    custom_description?: string;
  }
  
  export interface SceneDialog {
    character_id?: string;
    character_name?: string;
    text: string;
    bubble_type: string;
    position: string;
  }
  
  // Panel layout options
  export const panelLayoutOptions = [
    { value: 'single', label: 'Single Panel', description: 'A single full-page panel' },
    { value: 'horizontal_2', label: '2-Panel Horizontal', description: 'Two panels side by side' },
    { value: 'vertical_2', label: '2-Panel Vertical', description: 'Two panels stacked vertically' },
    { value: 'grid_4', label: '4-Panel Grid', description: 'Four panels in a 2×2 grid' },
    { value: 'grid_6', label: '6-Panel Grid', description: 'Six panels in a 2×3 grid' },
    { value: 'grid_9', label: '9-Panel Grid', description: 'Nine panels in a 3×3 grid' },
    { value: 'asymmetric_3', label: '3-Panel Asymmetric', description: 'Three panels in an asymmetric layout' },
    { value: 'asymmetric_5', label: '5-Panel Asymmetric', description: 'Five panels in an asymmetric layout' },
    { value: 'manga_dynamic', label: 'Dynamic Manga Layout', description: 'Irregular panels with dynamic arrangement' },
    { value: 'custom', label: 'Custom Layout', description: 'Create your own panel arrangement' },
  ];
  
  // Scene style options
  export const sceneStyles = [
    { value: 'manga', label: 'Traditional Manga', description: 'Black and white manga style with clean linework' },
    { value: 'anime', label: 'Anime Style', description: 'Colored anime-style artwork' },
    { value: 'watercolor', label: 'Watercolor', description: 'Soft watercolor painting style' },
    { value: 'sketchy', label: 'Sketch Style', description: 'Hand-drawn sketch aesthetic' },
    { value: 'cel_shaded', label: 'Cel Shaded', description: 'Bold outlines with flat coloring' },
    { value: 'realistic_manga', label: 'Realistic Manga', description: 'Detailed manga with realistic proportions' },
    { value: 'chibi', label: 'Chibi Style', description: 'Cute, small characters with oversized heads' },
    { value: 'noir', label: 'Manga Noir', description: 'High contrast black and white with dramatic shadows' },
    { value: 'retro', label: 'Retro Manga', description: 'Classic 70s-90s manga aesthetic' },
  ];
  
  // Scene type options
  export const sceneTypeOptions = [
    { value: 'action', label: 'Action Scene', description: 'Dynamic scene with movement and energy' },
    { value: 'dialogue', label: 'Dialogue Scene', description: 'Characters conversing with each other' },
    { value: 'establishing_shot', label: 'Establishing Shot', description: 'Setting the scene or location' },
    { value: 'emotional', label: 'Emotional Moment', description: 'Focus on character emotions and reactions' },
    { value: 'flashback', label: 'Flashback', description: 'Scene from a past event' },
    { value: 'montage', label: 'Montage', description: 'Series of related images or moments' },
    { value: 'reveal', label: 'Dramatic Reveal', description: 'Unveiling something significant' },
    { value: 'transition', label: 'Transition', description: 'Scene bridging between locations or moments' },
    { value: 'battle', label: 'Battle Scene', description: 'Combat or confrontation between characters' },
    { value: 'slice_of_life', label: 'Slice of Life', description: 'Everyday moments and activities' },
  ];
  
  // Camera angle options
  export const cameraAngleOptions = [
    { value: 'eye_level', label: 'Eye Level', description: 'Standard eye-level perspective' },
    { value: 'low_angle', label: 'Low Angle', description: 'Looking up at subject, creates power/dominance' },
    { value: 'high_angle', label: 'High Angle', description: 'Looking down at subject, creates vulnerability' },
    { value: 'birds_eye', label: 'Bird\'s Eye View', description: 'Looking directly down from above' },
    { value: 'worms_eye', label: 'Worm\'s Eye View', description: 'Looking directly up from below' },
    { value: 'dutch_angle', label: 'Dutch Angle', description: 'Tilted frame creating disorientation' },
    { value: 'over_shoulder', label: 'Over-the-Shoulder', description: 'From behind one character looking at another' },
    { value: 'pov', label: 'POV Shot', description: 'From character\'s point of view' },
    { value: 'side_view', label: 'Side View', description: 'Profile view of the scene' },
  ];
  
  // Perspective options
  export const perspectiveOptions = [
    { value: 'normal', label: 'Normal Perspective', description: 'Standard perspective with natural proportions' },
    { value: 'wide_angle', label: 'Wide Angle', description: 'Expanded field of view, slight distortion' },
    { value: 'telephoto', label: 'Telephoto', description: 'Compressed perspective, flattened depth' },
    { value: 'fisheye', label: 'Fisheye', description: 'Extreme wide angle with curved distortion' },
    { value: 'isometric', label: 'Isometric', description: 'No perspective, parallel lines remain parallel' },
    { value: '1_point', label: 'One-Point Perspective', description: 'Single vanishing point' },
    { value: '2_point', label: 'Two-Point Perspective', description: 'Two vanishing points' },
    { value: '3_point', label: 'Three-Point Perspective', description: 'Three vanishing points, dramatic effect' },
    { value: 'foreshortening', label: 'Foreshortening', description: 'Exaggerated perspective for dramatic effect' },
  ];
  
  // Time of day options
  export const timeOfDayOptions = [
    { value: 'dawn', label: 'Dawn', description: 'Early morning light, soft golden hues' },
    { value: 'morning', label: 'Morning', description: 'Bright, clear daylight' },
    { value: 'midday', label: 'Midday', description: 'Harsh overhead sunlight, strong shadows' },
    { value: 'afternoon', label: 'Afternoon', description: 'Warm, angled light' },
    { value: 'sunset', label: 'Sunset', description: 'Golden hour with long shadows' },
    { value: 'dusk', label: 'Dusk', description: 'Fading light, blue-purple tones' },
    { value: 'night', label: 'Night', description: 'Darkness with artificial or moon lighting' },
    { value: 'midnight', label: 'Midnight', description: 'Deep night, minimal lighting' },
  ];
  
  // Lighting options
  export const lightingOptions = [
    { value: 'natural', label: 'Natural Lighting', description: 'Realistic lighting from natural sources' },
    { value: 'dramatic', label: 'Dramatic', description: 'High contrast with strong shadows' },
    { value: 'soft', label: 'Soft Lighting', description: 'Diffused light with gentle shadows' },
    { value: 'harsh', label: 'Harsh Lighting', description: 'Strong direct light with sharp shadows' },
    { value: 'backlit', label: 'Backlit', description: 'Light source behind subject, creating silhouette' },
    { value: 'rim_light', label: 'Rim Light', description: 'Subject outlined with light' },
    { value: 'spotlit', label: 'Spotlit', description: 'Focused light on specific area' },
    { value: 'moody', label: 'Moody', description: 'Dark atmosphere with minimal lighting' },
    { value: 'colored', label: 'Colored Lighting', description: 'Light with specific color tint' },
    { value: 'ambient', label: 'Ambient', description: 'Soft, even lighting throughout scene' },
  ];
  
  // Weather options
  export const weatherOptions = [
    { value: 'clear', label: 'Clear', description: 'Clear skies with no clouds' },
    { value: 'partly_cloudy', label: 'Partly Cloudy', description: 'Mix of clouds and clear sky' },
    { value: 'overcast', label: 'Overcast', description: 'Full cloud cover, diffused light' },
    { value: 'rain', label: 'Rain', description: 'Rainfall of varying intensity' },
    { value: 'thunderstorm', label: 'Thunderstorm', description: 'Storm with lightning and rain' },
    { value: 'snow', label: 'Snow', description: 'Snowfall with cold atmosphere' },
    { value: 'fog', label: 'Fog/Mist', description: 'Reduced visibility, atmospheric' },
    { value: 'windy', label: 'Windy', description: 'Strong winds affecting the environment' },
    { value: 'storm', label: 'Storm', description: 'Intense weather conditions' },
  ];
  
  // Environment options
  export const environmentOptions = [
    { value: 'urban', label: 'Urban', description: 'City streets and buildings' },
    { value: 'rural', label: 'Rural', description: 'Countryside or village setting' },
    { value: 'forest', label: 'Forest', description: 'Wooded areas with trees' },
    { value: 'mountains', label: 'Mountains', description: 'Mountainous terrain' },
    { value: 'beach', label: 'Beach/Coast', description: 'Coastal setting with sand and ocean' },
    { value: 'desert', label: 'Desert', description: 'Arid landscape with sand or rock' },
    { value: 'jungle', label: 'Jungle', description: 'Dense tropical forest' },
    { value: 'underwater', label: 'Underwater', description: 'Beneath the ocean or water' },
    { value: 'space', label: 'Space', description: 'Outer space or cosmic setting' },
    { value: 'school', label: 'School', description: 'Educational facility interior or grounds' },
    { value: 'home', label: 'Home', description: 'Residential interior or exterior' },
    { value: 'office', label: 'Office/Workplace', description: 'Professional work environment' },
    { value: 'fantasy', label: 'Fantasy Realm', description: 'Magical or mythical setting' },
    { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi or advanced technology setting' },
    { value: 'historical', label: 'Historical', description: 'Past era or period setting' },
    { value: 'battlefield', label: 'Battlefield', description: 'Combat or war zone' },
    { value: 'dojo', label: 'Dojo/Training Hall', description: 'Martial arts training facility' },
    { value: 'restaurant', label: 'Restaurant', description: 'Dining establishment' },
  ];
  
  // Mood options
  export const moodOptions = [
    { value: 'tense', label: 'Tense', description: 'Suspenseful atmosphere' },
    { value: 'peaceful', label: 'Peaceful', description: 'Calm and serene atmosphere' },
    { value: 'mysterious', label: 'Mysterious', description: 'Enigmatic and intriguing' },
    { value: 'romantic', label: 'Romantic', description: 'Love and affection' },
    { value: 'melancholic', label: 'Melancholic', description: 'Sad and reflective' },
    { value: 'joyful', label: 'Joyful', description: 'Happy and uplifting' },
    { value: 'ominous', label: 'Ominous', description: 'Foreboding and threatening' },
    { value: 'epic', label: 'Epic', description: 'Grand and awe-inspiring' },
    { value: 'comical', label: 'Comical', description: 'Funny and lighthearted' },
    { value: 'dramatic', label: 'Dramatic', description: 'Intense emotional impact' },
    { value: 'surreal', label: 'Surreal', description: 'Dreamlike and bizarre' },
    { value: 'nostalgic', label: 'Nostalgic', description: 'Wistful remembrance' },
    { value: 'heroic', label: 'Heroic', description: 'Brave and inspiring' },
    { value: 'horrific', label: 'Horrific', description: 'Frightening and disturbing' },
  ];
  
  // Action options
  export const actionOptions = [
    { value: 'fighting', label: 'Fighting', description: 'Combat or physical conflict' },
    { value: 'running', label: 'Running/Chasing', description: 'Fast movement or pursuit' },
    { value: 'talking', label: 'Conversing', description: 'Characters in discussion' },
    { value: 'training', label: 'Training', description: 'Practicing skills or abilities' },
    { value: 'eating', label: 'Eating', description: 'Consuming food' },
    { value: 'falling', label: 'Falling', description: 'Character falling through air' },
    { value: 'flying', label: 'Flying', description: 'Aerial movement' },
    { value: 'jumping', label: 'Jumping', description: 'Leaping or bounding' },
    { value: 'sneaking', label: 'Sneaking', description: 'Stealthy movement' },
    { value: 'relaxing', label: 'Relaxing', description: 'Resting or leisure activity' },
    { value: 'transforming', label: 'Transforming', description: 'Character changing form' },
    { value: 'arguing', label: 'Arguing', description: 'Heated discussion or conflict' },
    { value: 'celebrating', label: 'Celebrating', description: 'Festive or joyous activity' },
    { value: 'studying', label: 'Studying', description: 'Learning or researching' },
    { value: 'sleeping', label: 'Sleeping', description: 'Character at rest' },
    { value: 'meeting', label: 'Meeting', description: 'Characters encountering each other' },
    { value: 'unveiling', label: 'Unveiling', description: 'Revealing something important' },
    { value: 'confronting', label: 'Confronting', description: 'Facing off in a tense situation' },
  ];
  
  // Character position options
  export const characterPositionOptions = [
    { value: 'center', label: 'Center', description: 'In the middle of the frame' },
    { value: 'left', label: 'Left Side', description: 'On the left side of the frame' },
    { value: 'right', label: 'Right Side', description: 'On the right side of the frame' },
    { value: 'foreground', label: 'Foreground', description: 'In front, closest to viewer' },
    { value: 'midground', label: 'Midground', description: 'In the middle distance' },
    { value: 'background', label: 'Background', description: 'In the distance' },
    { value: 'top', label: 'Top', description: 'At the top of the frame' },
    { value: 'bottom', label: 'Bottom', description: 'At the bottom of the frame' },
    { value: 'off_panel', label: 'Off Panel', description: 'Speaking from outside the frame' },
  ];
  
  // Effect options
  export const effectOptions = [
    { value: 'speed_lines', label: 'Speed Lines', description: 'Lines indicating fast movement' },
    { value: 'impact_stars', label: 'Impact Stars', description: 'Star shapes showing impact or collision' },
    { value: 'sound_effect', label: 'Sound Effect', description: 'Visualized sound (boom, crash, etc.)' },
    { value: 'emotion_symbols', label: 'Emotion Symbols', description: 'Symbols showing character emotions' },
    { value: 'sweat_drops', label: 'Sweat Drops', description: 'Indicating nervousness or exertion' },
    { value: 'background_effects', label: 'Background Effects', description: 'Abstract patterns in background' },
    { value: 'glow', label: 'Glow/Aura', description: 'Character or object emitting light' },
    { value: 'dust_cloud', label: 'Dust Cloud', description: 'Showing rapid movement or impact' },
    { value: 'sparkle', label: 'Sparkles', description: 'Glittering effects for beauty or magic' },
    { value: 'energy_burst', label: 'Energy Burst', description: 'Explosion of energy or power' },
    { value: 'focus_lines', label: 'Focus Lines', description: 'Lines drawing attention to a point' },
    { value: 'blurred_motion', label: 'Blurred Motion', description: 'Showing movement through blur' },
  ];
  
  // Dialog bubble options
  export const dialogBubbleOptions = [
    { value: 'normal', label: 'Standard Bubble', description: 'Normal speech bubble' },
    { value: 'thought', label: 'Thought Bubble', description: 'Cloud-like bubble for thoughts' },
    { value: 'shouting', label: 'Shouting Bubble', description: 'Jagged edge for shouting/yelling' },
    { value: 'whisper', label: 'Whisper Bubble', description: 'Dotted outline for whispers' },
    { value: 'internal', label: 'Internal Dialog', description: 'For character\'s inner voice' },
    { value: 'electronic', label: 'Electronic', description: 'For phone/device communication' },
    { value: 'narrator', label: 'Narrator Box', description: 'Box for narrator or captions' },
    { value: 'off_panel', label: 'Off-Panel', description: 'Speech from someone outside the frame' },
  ];
  
  // Composition options
  export const compositionOptions = [
    { value: 'rule_of_thirds', label: 'Rule of Thirds', description: 'Subject placed at intersection points' },
    { value: 'symmetrical', label: 'Symmetrical', description: 'Balanced elements on either side' },
    { value: 'asymmetrical', label: 'Asymmetrical', description: 'Intentionally unbalanced for tension' },
    { value: 'framing', label: 'Framing', description: 'Subject framed by elements in scene' },
    { value: 'leading_lines', label: 'Leading Lines', description: 'Lines guiding viewer\'s eye' },
    { value: 'diagonal', label: 'Diagonal', description: 'Dynamic composition using diagonal lines' },
    { value: 'radial', label: 'Radial', description: 'Elements radiating from center point' },
    { value: 'triangular', label: 'Triangular', description: 'Elements arranged in triangle shape' },
    { value: 'golden_ratio', label: 'Golden Ratio', description: 'Mathematically harmonious arrangement' },
  ];
  
  // Scene generator tabs
  export const sceneGeneratorTabs = [
    { id: 'layout', label: 'Layout & Style' },
    { id: 'setting', label: 'Setting & Mood' },
    { id: 'characters', label: 'Characters' },
    { id: 'dialog', label: 'Dialog' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  // Quality presets
  export const sceneQualityPresets = [
    { value: 'draft', label: 'Draft (Quick)', description: 'Generates quickly with basic detail' },
    { value: 'standard', label: 'Standard', description: 'Balanced quality and generation time' },
    { value: 'high', label: 'High Quality', description: 'Detailed output with longer generation time' },
  ];
  
  // Guidance settings
  export const sceneGuidanceSettings = [
    { value: 1, label: 'Very Creative', description: 'More stylistic freedom but less predictable' },
    { value: 7, label: 'Balanced', description: 'Good balance between creativity and adherence to prompt' },
    { value: 15, label: 'Very Precise', description: 'Closely follows your prompt but less creative variation' },
  ];
  
  // Default generation parameters
  export const defaultSceneGenerationParams = {
    width: 1024,
    height: 768,
    guidance_scale: 7,
    num_inference_steps: 30,
    seed: null, // Random seed
    negative_prompt: "nsfw, nude, bad anatomy, deformed, cropped, low quality, pixelated, bad composition"
  };
  
  // Scene aspect ratios
  export const sceneAspectRatios = [
    { value: 'landscape', label: 'Landscape (4:3)', width: 1024, height: 768 },
    { value: 'widescreen', label: 'Widescreen (16:9)', width: 1024, height: 576 },
    { value: 'square', label: 'Square (1:1)', width: 768, height: 768 },
    { value: 'portrait', label: 'Portrait (3:4)', width: 768, height: 1024 },
    { value: 'wide', label: 'Wide (2:1)', width: 1024, height: 512 },
    { value: 'tall', label: 'Tall (1:2)', width: 512, height: 1024 },
    { value: 'manga_page', label: 'Manga Page', width: 880, height: 1200 },
  ];
  
  // Scene export formats
  export const sceneExportFormats = [
    { value: 'png', label: 'PNG Image' },
    { value: 'transparent_png', label: 'Transparent PNG' },
    { value: 'panel_layout', label: 'Panel Layout (PSD)' },
    { value: 'json', label: 'Scene Data (JSON)' }
  ];