import type { Config } from "tailwindcss";

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
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
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
          			'0%, 100%': { boxShadow: '0 0 15px rgba(194, 63, 220, 0.5)' },
          			'50%': { boxShadow: '0 0 30px rgba(194, 63, 220, 0.8)' },
        		},
        		shimmer: {
          			'0%': { backgroundPosition: '-200% 0' },
          			'100%': { backgroundPosition: '200% 0' },
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
    			'glow': 'glow 3s ease-in-out infinite',
    			'shimmer': 'shimmer 3s linear infinite',
    		},
    		backgroundImage: {
        		'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        		'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        		'text-gradient': 'linear-gradient(to right, #C23FDC, #5B73FF)',
      		},
      		backdropFilter: {
        		'none': 'none',
        		'blur': 'blur(8px)',
      		},
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		// If you want to add backdrop filter support
		// require('tailwindcss-backdrop-filter'),
	],
} satisfies Config;