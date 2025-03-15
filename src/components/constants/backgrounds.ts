// src/components/constants/backgrounds.ts

export interface Background {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    project_id: string | null;
    metadata: BackgroundMetadata;
    image_url: string | null;
  }
  
  export interface BackgroundMetadata {
    background_type: string;
    style: string;
    setting: string;
    time_of_day?: string;
    weather?: string;
    mood?: string;
    perspective?: string;
    lighting?: string;
    season?: string;
    environment_elements?: string[];
    architectural_elements?: string[];
    props?: string[];
    theme?: string;
    additional_details?: string;
    prompt_used?: string;
    negative_prompt?: string;
    generation_params?: any;
  }
  
  // Background type options
  export const backgroundTypes = [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci_fi', label: 'Sci-Fi' },
    { value: 'urban', label: 'Urban' },
    { value: 'rural', label: 'Rural' },
    { value: 'abstract', label: 'Abstract' },
  ];
  
  // Background art style options
  export const backgroundStyles = [
    { value: 'anime', label: 'Anime' },
    { value: 'manga', label: 'Manga' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'sketch', label: 'Sketch Style' },
    { value: 'detailed', label: 'Detailed Illustration' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'cel_shaded', label: 'Cel Shaded' },
    { value: 'comic_book', label: 'Comic Book' },
  ];
  
  // Indoor settings
  export const indoorSettings = [
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'school_corridor', label: 'School Corridor' },
    { value: 'cafe', label: 'Café/Restaurant' },
    { value: 'library', label: 'Library' },
    { value: 'office', label: 'Office' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'traditional_japanese_room', label: 'Traditional Japanese Room' },
    { value: 'hospital_room', label: 'Hospital Room' },
    { value: 'gymnasium', label: 'Gymnasium' },
    { value: 'dojo', label: 'Dojo/Training Hall' },
    { value: 'basement', label: 'Basement' },
    { value: 'attic', label: 'Attic' },
    { value: 'throne_room', label: 'Throne Room' },
    { value: 'spaceship_interior', label: 'Spaceship Interior' },
    { value: 'store', label: 'Store/Shop' },
    { value: 'hallway', label: 'Hallway' },
    { value: 'bathroom', label: 'Bathroom' },
  ];
  
  // Outdoor settings
  export const outdoorSettings = [
    { value: 'city_street', label: 'City Street' },
    { value: 'park', label: 'Park' },
    { value: 'forest', label: 'Forest' },
    { value: 'beach', label: 'Beach' },
    { value: 'mountains', label: 'Mountains' },
    { value: 'school_courtyard', label: 'School Courtyard' },
    { value: 'garden', label: 'Garden' },
    { value: 'meadow', label: 'Meadow' },
    { value: 'rooftop', label: 'Rooftop' },
    { value: 'desert', label: 'Desert' },
    { value: 'jungle', label: 'Jungle' },
    { value: 'river', label: 'River' },
    { value: 'lake', label: 'Lake' },
    { value: 'waterfall', label: 'Waterfall' },
    { value: 'cliff', label: 'Cliff' },
    { value: 'ruins', label: 'Ruins' },
    { value: 'suburban_neighborhood', label: 'Suburban Neighborhood' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'bridge', label: 'Bridge' },
    { value: 'shrine', label: 'Shrine/Temple' },
  ];
  
  // Fantasy settings
  export const fantasySettings = [
    { value: 'castle', label: 'Castle' },
    { value: 'enchanted_forest', label: 'Enchanted Forest' },
    { value: 'crystal_cave', label: 'Crystal Cave' },
    { value: 'floating_islands', label: 'Floating Islands' },
    { value: 'dragon_lair', label: 'Dragon Lair' },
    { value: 'wizard_tower', label: 'Wizard Tower' },
    { value: 'magical_library', label: 'Magical Library' },
    { value: 'ancient_temple', label: 'Ancient Temple' },
    { value: 'fairy_village', label: 'Fairy Village' },
    { value: 'underwater_kingdom', label: 'Underwater Kingdom' },
    { value: 'elven_city', label: 'Elven City' },
    { value: 'dwarven_mines', label: 'Dwarven Mines' },
    { value: 'sky_kingdom', label: 'Sky Kingdom' },
    { value: 'magic_academy', label: 'Magic Academy' },
    { value: 'demon_realm', label: 'Demon Realm' },
    { value: 'spirit_world', label: 'Spirit World' },
    { value: 'mythical_battlefield', label: 'Mythical Battlefield' },
    { value: 'forgotten_sanctuary', label: 'Forgotten Sanctuary' },
    { value: 'elemental_plane', label: 'Elemental Plane' },
    { value: 'magical_portal', label: 'Magical Portal' },
  ];
  
  // Sci-Fi settings
  export const sciFiSettings = [
    { value: 'futuristic_city', label: 'Futuristic City' },
    { value: 'space_station', label: 'Space Station' },
    { value: 'spaceship_deck', label: 'Spaceship Deck' },
    { value: 'alien_planet', label: 'Alien Planet' },
    { value: 'cyberpunk_street', label: 'Cyberpunk Street' },
    { value: 'laboratory', label: 'High-tech Laboratory' },
    { value: 'space_colony', label: 'Space Colony' },
    { value: 'control_room', label: 'Control Room' },
    { value: 'mech_hangar', label: 'Mech Hangar' },
    { value: 'virtual_reality', label: 'Virtual Reality Space' },
    { value: 'space_battlefield', label: 'Space Battlefield' },
    { value: 'dystopian_wasteland', label: 'Dystopian Wasteland' },
    { value: 'underground_bunker', label: 'Underground Bunker' },
    { value: 'holographic_chamber', label: 'Holographic Chamber' },
    { value: 'robotics_facility', label: 'Robotics Facility' },
    { value: 'lunar_base', label: 'Lunar Base' },
    { value: 'asteroid_mining_colony', label: 'Asteroid Mining Colony' },
    { value: 'wormhole', label: 'Wormhole/Space Anomaly' },
    { value: 'terraformed_landscape', label: 'Terraformed Landscape' },
    { value: 'cryogenic_facility', label: 'Cryogenic Facility' },
  ];
  
  // Urban settings
  export const urbanSettings = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'alleyway', label: 'Alleyway' },
    { value: 'shopping_district', label: 'Shopping District' },
    { value: 'subway_station', label: 'Subway Station' },
    { value: 'train_station', label: 'Train Station' },
    { value: 'high_rise_building', label: 'High-rise Building' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'rooftop', label: 'City Rooftop' },
    { value: 'skyscraper', label: 'Skyscraper' },
    { value: 'convenience_store', label: 'Convenience Store' },
    { value: 'arcade', label: 'Arcade' },
    { value: 'night_club', label: 'Night Club' },
    { value: 'construction_site', label: 'Construction Site' },
    { value: 'parking_lot', label: 'Parking Lot' },
    { value: 'abandoned_building', label: 'Abandoned Building' },
    { value: 'city_park', label: 'City Park' },
    { value: 'bus_stop', label: 'Bus Stop' },
    { value: 'pedestrian_crossing', label: 'Pedestrian Crossing' },
    { value: 'highway', label: 'Highway' },
    { value: 'underpass', label: 'Underpass' },
  ];
  
  // Rural settings
  export const ruralSettings = [
    { value: 'farm', label: 'Farm' },
    { value: 'rice_field', label: 'Rice Field' },
    { value: 'village', label: 'Village' },
    { value: 'countryside_road', label: 'Countryside Road' },
    { value: 'barn', label: 'Barn' },
    { value: 'farmhouse', label: 'Farmhouse' },
    { value: 'windmill', label: 'Windmill' },
    { value: 'countryside_shrine', label: 'Countryside Shrine' },
    { value: 'small_town', label: 'Small Town' },
    { value: 'vineyard', label: 'Vineyard' },
    { value: 'orchard', label: 'Orchard' },
    { value: 'rural_train_station', label: 'Rural Train Station' },
    { value: 'old_well', label: 'Old Well' },
    { value: 'country_store', label: 'Country Store' },
    { value: 'hillside', label: 'Hillside' },
    { value: 'pasture', label: 'Pasture' },
    { value: 'greenhouse', label: 'Greenhouse' },
    { value: 'mill', label: 'Mill' },
    { value: 'riverbank', label: 'Riverbank' },
    { value: 'fishing_dock', label: 'Fishing Dock' },
  ];
  
  // Abstract settings
  export const abstractSettings = [
    { value: 'geometric', label: 'Geometric Patterns' },
    { value: 'swirling_colors', label: 'Swirling Colors' },
    { value: 'dream_sequence', label: 'Dream Sequence' },
    { value: 'memory_fragment', label: 'Memory Fragment' },
    { value: 'emotional_landscape', label: 'Emotional Landscape' },
    { value: 'void', label: 'Void' },
    { value: 'digital_realm', label: 'Digital Realm' },
    { value: 'astral_plane', label: 'Astral Plane' },
    { value: 'subconscious', label: 'Subconscious' },
    { value: 'spiritual_plane', label: 'Spiritual Plane' },
    { value: 'mindscape', label: 'Mindscape' },
    { value: 'energy_flow', label: 'Energy Flow' },
    { value: 'time_distortion', label: 'Time Distortion' },
    { value: 'liminal_space', label: 'Liminal Space' },
    { value: 'cosmic_void', label: 'Cosmic Void' },
    { value: 'kaleidoscope', label: 'Kaleidoscope' },
    { value: 'fractal_landscape', label: 'Fractal Landscape' },
    { value: 'symbolic_representation', label: 'Symbolic Representation' },
    { value: 'emotional_storm', label: 'Emotional Storm' },
    { value: 'alternate_dimension', label: 'Alternate Dimension' },
  ];
  
  // Time of day options
  export const timeOfDayOptions = [
    { value: 'dawn', label: 'Dawn' },
    { value: 'morning', label: 'Morning' },
    { value: 'noon', label: 'Noon' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'dusk', label: 'Dusk' },
    { value: 'evening', label: 'Evening' },
    { value: 'night', label: 'Night' },
    { value: 'midnight', label: 'Midnight' },
  ];
  
  // Weather options
  export const weatherOptions = [
    { value: 'clear', label: 'Clear' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'partly_cloudy', label: 'Partly Cloudy' },
    { value: 'overcast', label: 'Overcast' },
    { value: 'rainy', label: 'Rainy' },
    { value: 'heavy_rain', label: 'Heavy Rain' },
    { value: 'thunderstorm', label: 'Thunderstorm' },
    { value: 'snowy', label: 'Snowy' },
    { value: 'blizzard', label: 'Blizzard' },
    { value: 'foggy', label: 'Foggy' },
    { value: 'misty', label: 'Misty' },
    { value: 'hazy', label: 'Hazy' },
    { value: 'windy', label: 'Windy' },
    { value: 'stormy', label: 'Stormy' },
    { value: 'rainbow', label: 'Rainbow' },
    { value: 'tornado', label: 'Tornado' },
    { value: 'hurricane', label: 'Hurricane' },
    { value: 'sandstorm', label: 'Sandstorm' },
  ];
  
  // Mood/atmosphere options
  export const moodOptions = [
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'serene', label: 'Serene' },
    { value: 'cheerful', label: 'Cheerful' },
    { value: 'uplifting', label: 'Uplifting' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'eerie', label: 'Eerie' },
    { value: 'gloomy', label: 'Gloomy' },
    { value: 'foreboding', label: 'Foreboding' },
    { value: 'tense', label: 'Tense' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'hopeful', label: 'Hopeful' },
    { value: 'inspiring', label: 'Inspiring' },
    { value: 'magical', label: 'Magical' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'chaotic', label: 'Chaotic' },
    { value: 'tranquil', label: 'Tranquil' },
    { value: 'desolate', label: 'Desolate' },
    { value: 'whimsical', label: 'Whimsical' },
  ];
  
  // Perspective options
  export const perspectiveOptions = [
    { value: 'eye_level', label: 'Eye Level' },
    { value: 'birds_eye', label: 'Bird\'s Eye View' },
    { value: 'worms_eye', label: 'Worm\'s Eye View' },
    { value: 'high_angle', label: 'High Angle' },
    { value: 'low_angle', label: 'Low Angle' },
    { value: 'overhead', label: 'Overhead' },
    { value: 'dutch_angle', label: 'Dutch Angle (Tilted)' },
    { value: 'isometric', label: 'Isometric' },
    { value: 'one_point', label: 'One-Point Perspective' },
    { value: 'two_point', label: 'Two-Point Perspective' },
    { value: 'three_point', label: 'Three-Point Perspective' },
    { value: 'panoramic', label: 'Panoramic' },
    { value: 'fisheye', label: 'Fisheye' },
    { value: 'close_up', label: 'Close-Up' },
    { value: 'extreme_close_up', label: 'Extreme Close-Up' },
    { value: 'wide_shot', label: 'Wide Shot' },
    { value: 'extreme_wide_shot', label: 'Extreme Wide Shot' },
  ];
  
  // Lighting options
  export const lightingOptions = [
    { value: 'natural', label: 'Natural Light' },
    { value: 'soft', label: 'Soft Lighting' },
    { value: 'harsh', label: 'Harsh Lighting' },
    { value: 'dramatic', label: 'Dramatic Lighting' },
    { value: 'backlit', label: 'Backlit' },
    { value: 'silhouette', label: 'Silhouette' },
    { value: 'rim_light', label: 'Rim Light' },
    { value: 'moonlight', label: 'Moonlight' },
    { value: 'sunset_light', label: 'Sunset Light' },
    { value: 'golden_hour', label: 'Golden Hour' },
    { value: 'blue_hour', label: 'Blue Hour' },
    { value: 'neon', label: 'Neon Lighting' },
    { value: 'fluorescent', label: 'Fluorescent Lighting' },
    { value: 'candlelight', label: 'Candlelight' },
    { value: 'fire_light', label: 'Fire Light' },
    { value: 'lantern', label: 'Lantern Light' },
    { value: 'spotlight', label: 'Spotlight' },
    { value: 'ambient', label: 'Ambient Light' },
    { value: 'shadow_play', label: 'Shadow Play' },
    { value: 'volumetric', label: 'Volumetric Light' },
  ];
  
  // Season options
  export const seasonOptions = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall/Autumn' },
    { value: 'winter', label: 'Winter' },
    { value: 'rainy_season', label: 'Rainy Season' },
    { value: 'dry_season', label: 'Dry Season' },
    { value: 'cherry_blossom', label: 'Cherry Blossom Season' },
    { value: 'harvest', label: 'Harvest Season' },
  ];
  
  // Environment elements options
  export const environmentElements = [
    // Nature elements
    { value: 'trees', label: 'Trees' },
    { value: 'flowers', label: 'Flowers' },
    { value: 'grass', label: 'Grass' },
    { value: 'rocks', label: 'Rocks' },
    { value: 'mountains', label: 'Mountains' },
    { value: 'water', label: 'Water' },
    { value: 'clouds', label: 'Clouds' },
    { value: 'hills', label: 'Hills' },
    { value: 'bushes', label: 'Bushes' },
    { value: 'vines', label: 'Vines' },
    { value: 'moss', label: 'Moss' },
    { value: 'fallen_leaves', label: 'Fallen Leaves' },
    { value: 'snow', label: 'Snow' },
    { value: 'puddles', label: 'Puddles' },
    { value: 'fog', label: 'Fog' },
    { value: 'mist', label: 'Mist' },
    { value: 'islands', label: 'Islands' },
    { value: 'cliffs', label: 'Cliffs' },
    { value: 'caves', label: 'Caves' },
    { value: 'waterfalls', label: 'Waterfalls' },
  ];
  
  // Architectural elements options
  export const architecturalElements = [
    { value: 'buildings', label: 'Buildings' },
    { value: 'skyscrapers', label: 'Skyscrapers' },
    { value: 'houses', label: 'Houses' },
    { value: 'traditional_buildings', label: 'Traditional Buildings' },
    { value: 'ruins', label: 'Ruins' },
    { value: 'bridges', label: 'Bridges' },
    { value: 'tunnels', label: 'Tunnels' },
    { value: 'towers', label: 'Towers' },
    { value: 'castles', label: 'Castles' },
    { value: 'temples', label: 'Temples' },
    { value: 'shrines', label: 'Shrines' },
    { value: 'gates', label: 'Gates' },
    { value: 'fences', label: 'Fences' },
    { value: 'walls', label: 'Walls' },
    { value: 'windows', label: 'Windows' },
    { value: 'doors', label: 'Doors' },
    { value: 'stairs', label: 'Stairs' },
    { value: 'railway', label: 'Railway' },
    { value: 'paths', label: 'Paths' },
    { value: 'streets', label: 'Streets' },
  ];
  
  // Props options
  export const propElements = [
    { value: 'furniture', label: 'Furniture' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'signage', label: 'Signage' },
    { value: 'lamps', label: 'Lamps/Lighting' },
    { value: 'books', label: 'Books' },
    { value: 'technology', label: 'Technology' },
    { value: 'machinery', label: 'Machinery' },
    { value: 'weapons', label: 'Weapons' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food' },
    { value: 'musical_instruments', label: 'Musical Instruments' },
    { value: 'toys', label: 'Toys' },
    { value: 'sports_equipment', label: 'Sports Equipment' },
    { value: 'magical_items', label: 'Magical Items' },
    { value: 'futuristic_devices', label: 'Futuristic Devices' },
    { value: 'tools', label: 'Tools' },
    { value: 'containers', label: 'Containers' },
    { value: 'artwork', label: 'Artwork' },
    { value: 'decorations', label: 'Decorations' },
    { value: 'plants', label: 'Potted Plants' },
  ];
  
  // Theme options
  export const themeOptions = [
    { value: 'school_life', label: 'School Life' },
    { value: 'slice_of_life', label: 'Slice of Life' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'action', label: 'Action' },
    { value: 'romance', label: 'Romance' },
    { value: 'supernatural', label: 'Supernatural' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci_fi', label: 'Sci-Fi' },
    { value: 'historical', label: 'Historical' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'sports', label: 'Sports' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'steampunk', label: 'Steampunk' },
    { value: 'post_apocalyptic', label: 'Post-Apocalyptic' },
    { value: 'magical_realism', label: 'Magical Realism' },
    { value: 'dystopian', label: 'Dystopian' },
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
    width: 1024,
    height: 576,
    guidance_scale: 7,
    num_inference_steps: 30,
    seed: null, // Random seed
    negative_prompt: "nsfw, deformed, cropped, low quality, pixelated, bad composition"
  };
  
  // Background generator tabs
  export const backgroundGeneratorTabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'environment', label: 'Environment' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  // Background export formats
  export const backgroundExportFormats = [
    { value: 'png', label: 'PNG Image' },
    { value: 'jpg', label: 'JPG Image' },
    { value: 'json', label: 'Background Data (JSON)' }
  ];
  
  // Background aspect ratios
  export const backgroundAspectRatios = [
    { value: 'widescreen', label: 'Widescreen (16:9)', width: 1024, height: 576 },
    { value: 'landscape', label: 'Landscape (4:3)', width: 1024, height: 768 },
    { value: 'square', label: 'Square (1:1)', width: 768, height: 768 },
    { value: 'portrait', label: 'Portrait (3:4)', width: 768, height: 1024 },
    { value: 'panoramic', label: 'Panoramic (21:9)', width: 1344, height: 576 },
    { value: 'manga_panel', label: 'Manga Panel (3:2)', width: 1024, height: 683 },
  ];
  
  // Function to get settings based on background type
  export const getSettingsByType = (type: string) => {
    switch (type) {
      case 'indoor':
        return indoorSettings;
      case 'outdoor':
        return outdoorSettings;
      case 'fantasy':
        return fantasySettings;
      case 'sci_fi':
        return sciFiSettings;
      case 'urban':
        return urbanSettings;
      case 'rural':
        return ruralSettings;
      case 'abstract':
        return abstractSettings;
      default:
        return [];
    }
  };