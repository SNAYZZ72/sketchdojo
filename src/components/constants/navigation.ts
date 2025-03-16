export const siteNavigation = [
  {
    title: 'Features',
    href: '#features',
  },
  {
    title: 'Community',
    href: '#community',
  },
  {
    title: 'Pricing',
    href: '#pricing',
  },
]

export const pricingPlans = [
  {
    title: 'Free Trial',
    price: '$0',
    period: '/month',
    features: [
      'Basic AI character design',
      '5 backgrounds per month',
      'Community access',
      'Basic support',
    ],
    buttonText: 'Get Started',
    buttonLink: '/signup',
  },
  {
    title: 'Professional Plan',
    price: '$29',
    period: '/month',
    features: [
      'Basic AI character design',
      '5 backgrounds per month',
      'Community access',
      'Basic support',
      'Basic support',
    ],
    buttonText: 'Get Started',
    buttonLink: '/signup',
  },
  {
    title: 'Studio Plan',
    price: '$99',
    period: '/month',
    features: [
      'Basic AI character design',
      '5 backgrounds per month',
      'Community access',
      'Basic support',
      'Basic support',
    ],
    buttonText: 'Get Started',
    buttonLink: '/signup',
  },
]

// File: "@/components/constants/navigation.js"

export const features = [
  {
    title: 'Generate AI character',
    description:
      'Utilize our cutting-edge AI technology to craft captivating artwork for your comic panels, allowing you to concentrate on weaving your narrative. Explore diverse variations of each panel to discover the ideal visual expression for your storytelling.',
    image: '/features/ai-character-generator.gif',
    imageAlt: 'AI character generator interface',
    width: 600,
    height: 400,
  },
  {
    title: 'Create Amazing Layouts',
    description:
      'Create distinct manga panel layouts that seamlessly blend with your unique style and imaginative vision. Develop original compositions that capture the core of your artistic creativity and vividly breathe life into your storytelling through exceptional and engaging comic panels.',
    image: '/features/manga-layout-creator.gif',
    imageAlt: 'Manga layout creator interface',
    width: 600,
    height: 400,
  },
  {
    title: 'Inpainting',
    description:
      'Enhance your comic illustrations by skillfully editing and improving specific portions through the use of inpainting. Inpainting allows you to seamlessly refine and perfect elements within your existing artwork, adding a touch of precision to elevate the overall visual appeal of your comics.',
    image: '/features/inpainting.gif',
    imageAlt: 'Inpainting tool interface',
    width: 600,
    height: 400,
  },
  {
    title: 'Pose Creator Tool',
    description:
      'An easy-to-use tool to create dynamic poses for your characters using Open Cascaded. Craft unique poses for your manga characters with precision and ease. Experiment with different poses using the user-friendly tools tailored to bring your characters to life in a snap.',
    image: '/features/pose-creator.gif',
    imageAlt: 'Pose creator tool interface',
    width: 600,
    height: 400,
  },
  {
    title: 'Character Training',
    description:
      'Train the AI to draw custom characters using a dataset of regular photos. LoRa training makes it possible to create custom characters and keep the characters consistent across panels.',
    image: '/features/character-training.gif',
    imageAlt: 'Character training interface',
    width: 600,
    height: 400,
  },
];

export const communityGallery = [
  {
    title: 'Attaque des titans',
    author: '@Mathias',
    image: '/community/attaque-des-titans-1.png',
  },
  {
    title: 'Attaque des titans',
    author: '@Mathias',
    image: '/community/attaque-des-titans-2.png',
  },
  {
    title: 'Demon Slayer',
    author: '@Said',
    image: '/community/demon-slayer.png',
  },
  {
    title: 'One piece',
    author: '@Nathan',
    image: '/community/one-piece.png',
  },
  {
    title: 'The chill desirus',
    author: '@Matthieu',
    image: '/community/chill-desirus.png',
  },
]

// Footer navigation links
export const footerNavigation = {
  main: [
    { name: 'Pricing', href: '#pricing' },
    { name: 'Community', href: '#community' },
    { name: 'About us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
  ],
  social: [
    { name: 'TikTok', href: '#', icon: 'tiktok' },
    { name: 'YouTube', href: '#', icon: 'youtube' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
  ]
};

// Navigation item structure
export interface SidebarItem {
  href: string;
  label: string;
  icon: string; // Icon name from Lucide icons
}

// Navigation groups for sidebar
export interface SidebarGroup {
  title?: string; // Optional group title for sections
  items: SidebarItem[];
}

// Main sidebar navigation
export const sidebarNavigation: SidebarGroup[] = [
  {
    // Core Navigation
    items: [
      { href: '/studio', label: 'Dashboard', icon: 'Home' },
      { href: '/studio/projects', label: 'Projects', icon: 'Layers' },
      { href: '/studio/characters', label: 'Characters', icon: 'Users' },
      { href: '/studio/scenes', label: 'Scenes', icon: 'ImageIcon' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { href: '/studio/tools/generator', label: 'Image Generator', icon: 'Wand2' },
      { href: '/studio/tools/inpainting', label: 'Inpainting', icon: 'Palette' },
      { href: '/studio/tools/training', label: 'Character Training', icon: 'Sparkles' },
      { href: '/studio/tools/pose-creator', label: 'Pose Creator', icon: 'LayoutGrid' },
      { href: '/studio/tools/layout-creator', label: 'Layout Creator', icon: 'LayoutGrid' },
      { href: '/studio/tools/upscale', label: 'Upscale', icon: 'ArrowUp' },
      { href: '/studio/tools/ai-assistant', label: 'AI Assistant', icon: 'ChatBubble' },
      { href: '/studio/tools/translation', label: 'Translation', icon: 'Translate' },
      { href: '/studio/tools/voice-acting', label: 'Voice Acting', icon: 'Microphone' },
      { href: '/studio/tools/storyboard', label: 'Storyboard', icon: 'LayoutGrid' },
      { href: '/studio/tools/cover-design', label: 'Cover Design', icon: 'LayoutGrid' },
      { href: '/studio/tools/Chapters', label: 'Chapters', icon: 'LayoutGrid' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { href: '/studio/templates', label: 'Templates', icon: 'BookOpen' },
    ],
  },
  {
    // Settings & Help
    items: [
      { href: '/studio/settings', label: 'Settings', icon: 'Settings' },
      { href: '/studio/help', label: 'Help', icon: 'HelpCircle' },
    ],
  },
];
