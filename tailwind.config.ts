import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
			"./1772943089359125005.html"
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
			fontFamily: {
				cinzel: ['Cinzel', 'serif'],
				oswald: ['Oswald', 'sans-serif'],
				rajdhani: ['Rajdhani', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				},
				gold: {
					DEFAULT: '#D4A017',
					light: '#F5C842',
					dark: '#8B6914',
				},
				crimson: {
					DEFAULT: '#8B0000',
					light: '#CC2200',
					bright: '#FF3333',
				},
				shadow: {
					DEFAULT: '#0A0A0F',
					light: '#12121A',
					mid: '#1A1A2E',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'pulse-gold': {
					'0%, 100%': { boxShadow: '0 0 10px rgba(212,160,23,0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(212,160,23,0.8), 0 0 60px rgba(212,160,23,0.4)' }
				},
				'click-burst': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.15)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'damage-float': {
					'0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
					'100%': { transform: 'translateY(-80px) scale(0.7)', opacity: '0' }
				},
				'boss-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-5px) rotate(-1deg)' },
					'40%': { transform: 'translateX(5px) rotate(1deg)' },
					'60%': { transform: 'translateX(-3px)' },
					'80%': { transform: 'translateX(3px)' },
				},
				'screen-glow': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.7' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'rune-spin': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'particle': {
					'0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
					'100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: '0' }
				},
				'slide-in-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'hero-flash': {
					'0%': { opacity: '0', transform: 'scale(0.8)' },
					'20%': { opacity: '1', transform: 'scale(1.05)' },
					'60%': { opacity: '0.7' },
					'100%': { opacity: '0', transform: 'scale(1.2)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
				'click-burst': 'click-burst 0.2s ease-out',
				'damage-float': 'damage-float 1.2s ease-out forwards',
				'boss-shake': 'boss-shake 0.4s ease-out',
				'screen-glow': 'screen-glow 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.4s ease-out',
				'rune-spin': 'rune-spin 8s linear infinite',
				'slide-in-up': 'slide-in-up 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
				'hero-flash': 'hero-flash 0.9s ease-out forwards',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;