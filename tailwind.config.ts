import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

// Define types for plugin utilities
type PluginUtils = {
	addUtilities: (utilities: Record<string, Record<string, string>> | Record<string, Record<string, string>>[]) => void;
	theme: (path: string, defaultValue?: any) => any;
	e: (selector: string) => string;
};

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			roomify: {
    				bg: '#12111A',
    				text: '#FFFFFF',
    				primary: '#6200EE',
    				accent: '#FF4081',
    				hover: '#7B1FA2',
    				muted: '#6B7280',
    				light: '#1E1B2C',
    				card: '#1A1824',
    				border: '#2D2B37',
    				success: '#4CAF50',
    				warning: '#FFC107',
    				error: '#FF5252',
    				surface: '#1E1B2C'
    			},
    			// SketchDojo.AI specific colors
    			sketchdojo: {
    				primary: '#C23FDC',
    				'primary-light': '#D76AE8',
    				'primary-dark': '#9A32B0',
    				accent: '#5B73FF',
    				'accent-light': '#8695FF',
    				'accent-dark': '#3B4FD1',
    				bg: '#0F1729',
    				'bg-light': '#1A2333',
    				text: '#FFFFFF',
    				'text-muted': 'rgba(255, 255, 255, 0.8)',
    				'text-subtle': 'rgba(255, 255, 255, 0.6)',
    			},
    			// Generator app colors
    			primary: {
    				DEFAULT: '#5667FF',
    				light: '#7A8AFF',
    				dark: '#3A4AE0',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: '#FF56A9',
    				light: '#FF7AB9',
    				dark: '#E03A8A',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'sans-serif'
    			],
    			// Add Italianno for stylistic elements
    			italianno: [
    				'Italianno', 
    				'cursive'
    			]
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			fadeIn: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(10px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			scaleIn: {
    				'0%': {
    					transform: 'scale(0.95)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'scale(1)',
    					opacity: '1'
    				}
    			},
    			floating: {
    				'0%': { transform: 'translateY(0) rotate(0deg)' },
    				'50%': { transform: 'translateY(-15px) rotate(2deg)' },
    				'100%': { transform: 'translateY(0) rotate(0deg)' }
    			},
    			scroll: {
    				'0%': { transform: 'translateX(0)' },
    				'100%': { transform: 'translateX(-50%)' }
    			},
    			scrollReverse: {
    				'0%': { transform: 'translateX(-50%)' },
    				'100%': { transform: 'translateX(0)' }
    			},
    			pulse: {
          			'0%, 100%': { opacity: '1' },
          			'50%': { opacity: '0.5' },
        		},
        		glow: {
          			'0%, 100%': { boxShadow: '0 0 15px rgba(86, 103, 255, 0.5)' },
          			'50%': { boxShadow: '0 0 30px rgba(86, 103, 255, 0.8)' },
        		},
        		shimmer: {
          			'0%': { backgroundPosition: '-200% 0' },
          			'100%': { backgroundPosition: '200% 0' },
        		},
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                }
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fadeIn': 'fadeIn 0.5s ease-out',
    			'scaleIn': 'scaleIn 0.3s ease-out',
    			'floating': 'floating 6s ease-in-out infinite',
    			'floating-slow': 'floating 8s ease-in-out infinite',
    			'floating-fast': 'floating 4s ease-in-out infinite',
    			'scroll': 'scroll 40s linear infinite',
    			'scroll-reverse': 'scrollReverse 40s linear infinite',
    			'pulse': 'pulse 3s ease-in-out infinite',
    			'pulse-slow': 'pulse 8s ease-in-out infinite',
    			'glow': 'glow 3s ease-in-out infinite',
    			'shimmer': 'shimmer 3s linear infinite',
                'gradient': 'gradient 6s ease infinite',
                'gradient-slow': 'gradient 12s ease infinite'
    		},
    		backgroundImage: {
        		'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        		'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        		'text-gradient': 'linear-gradient(to right, #C23FDC, #5B73FF)',
                'primary-gradient': 'linear-gradient(90deg, #5667FF 0%, #FF56A9 100%)',
                'hover-primary-gradient': 'linear-gradient(90deg, #4A5AE0 0%, #E03A8A 100%)',
                'background-gradient': 'linear-gradient(180deg, #121218 0%, #1E1E28 100%)'
      		},
      		backdropFilter: {
        		'none': 'none',
        		'blur': 'blur(8px)',
      		},
            // Animation delay utilities
            animationDelay: {
                '500': '500ms',
                '1000': '1000ms',
                '1500': '1500ms',
                '2000': '2000ms',
                '3000': '3000ms',
            },
            // Background size utilities
            backgroundSize: {
                '200': '200% 200%',
            }
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		// If you want to add backdrop filter support
		// require('tailwindcss-backdrop-filter'),
        // Add support for animation delays
        function({ addUtilities, theme, e }: PluginUtils) {
            const animationDelayUtilities = Object.entries(theme('animationDelay') as Record<string, string>).map(
                ([key, value]) => ({
                    [`.${e(`animation-delay-${key}`)}`]: { animationDelay: value },
                })
            );
            
            addUtilities(animationDelayUtilities);
        },
        // Add support for background size
        function({ addUtilities, theme, e }: PluginUtils) {
            const bgSizeUtilities = Object.entries(theme('backgroundSize') as Record<string, string>).map(
                ([key, value]) => ({
                    [`.${e(`bg-size-${key}`)}`]: { backgroundSize: value },
                })
            );
            
            addUtilities(bgSizeUtilities);
        },
        plugin(function({ addUtilities, theme, e }: PluginUtils) {
            const animationDelayUtilities: Record<string, Record<string, string>> = {};
            const delayValues = theme('animationDelay', {
                '100': '100ms',
                '200': '200ms',
                '300': '300ms',
                '400': '400ms',
                '500': '500ms',
                '600': '600ms',
                '700': '700ms',
                '800': '800ms',
                '900': '900ms',
                '1000': '1000ms',
            });

            Object.entries(delayValues as Record<string, string>).forEach(([key, value]) => {
                animationDelayUtilities[`.${e(`delay-${key}`)}`] = {
                    'animation-delay': value,
                };
            });

            addUtilities(animationDelayUtilities);
        }),
        plugin(function({ addUtilities }: PluginUtils) {
            const backgroundUtilities = {
                '.bg-size-200': {
                    'background-size': '200% 200%',
                },
                '.bg-size-100': {
                    'background-size': '100% 100%',
                },
                '.animate-gradient': {
                    'animation': 'gradient 8s ease infinite',
                },
            };

            addUtilities(backgroundUtilities);
        }),
	],
} satisfies Config;