/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        
        // Mapping existing color names to new variables for backward compatibility
        architect: {
          900: 'rgb(var(--color-text-primary) / <alpha-value>)', // Was #09090b
          800: 'rgb(var(--color-text-primary) / <alpha-value>)', // Was #18181b - simplifying
          700: 'rgb(var(--color-text-secondary) / <alpha-value>)', // Was #27272a
          600: 'rgb(var(--color-text-secondary) / <alpha-value>)', // Was #52525b
          500: 'rgb(var(--color-text-secondary) / <alpha-value>)', // Was #71717a
          100: 'rgb(var(--color-surface) / <alpha-value>)', // Was #f4f4f5
          50: 'rgb(var(--color-background) / <alpha-value>)',  // Was #fafafa
        },
        accent: {
          gold: 'rgb(var(--color-accent) / <alpha-value>)', // Was #d97706
          teal: 'rgb(var(--color-primary) / <alpha-value>)', // Was #0d9488 - mapping to primary
          'teal-light': 'rgb(var(--color-secondary) / <alpha-value>)', // Was #2dd4bf
          'gold-light': 'rgb(var(--color-accent) / <alpha-value>)', // Was #fbbf24
        },
        // Keeping some legacy names mapped to new colors for compatibility during refactor
        nebula: {
          900: 'rgb(var(--color-background) / <alpha-value>)', // Background
          800: 'rgb(var(--color-surface) / <alpha-value>)', // Secondary background
          700: 'rgb(var(--color-border) / <alpha-value>)', // Borders/Separators
        },
        neon: {
          cyan: 'rgb(var(--color-primary) / <alpha-value>)',
          purple: 'rgb(var(--color-accent) / <alpha-value>)',
          magenta: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.05)',
          300: 'rgba(255, 255, 255, 0.02)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'float': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px var(--color-primary)',
        'glow-accent': '0 0 20px var(--color-accent)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, var(--color-primary) 0deg, var(--color-accent) 180deg, var(--color-primary) 360deg)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px -10px var(--color-primary)' },
          'to': { boxShadow: '0 0 30px 5px var(--color-primary)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        tilt: {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(1deg)',
          },
          '75%': {
            transform: 'rotate(-1deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
