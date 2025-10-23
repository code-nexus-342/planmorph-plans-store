import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fira Code', 'monospace'],
      },
      colors: {
        // Primary Brand Colors - Futuristic Cyan/Purple
        brand: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80e0ff',
          300: '#4dd4ff',
          400: '#1ac8ff',
          500: '#00d4ff', // Primary cyan
          600: '#00a8cc',
          700: '#007c99',
          800: '#005066',
          900: '#002433',
          950: '#001219',
        },
        cyan: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80e0ff',
          300: '#4dd4ff',
          400: '#1ac8ff',
          500: '#00d4ff',
          600: '#00a8cc',
          700: '#007c99',
          800: '#005066',
          900: '#002433',
        },
        purple: {
          50: '#f3e8ff',
          100: '#e4c9ff',
          200: '#d4a4ff',
          300: '#c380ff',
          400: '#a855f7',
          500: '#7b2ff7',
          600: '#6622c4',
          700: '#511a91',
          800: '#3c125e',
          900: '#270a2b',
        },
        pink: {
          50: '#ffe0f0',
          100: '#ffb3d6',
          200: '#ff80bb',
          300: '#ff4da1',
          400: '#ff1a86',
          500: '#ff2e97',
          600: '#cc2578',
          700: '#991c5a',
          800: '#66133c',
          900: '#330a1e',
        },
        // Dark Theme Colors - Enhanced
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0a0f',
        },
        // Surface Colors
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          card: 'var(--surface-card)',
        },
        // Text Colors
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
          subtle: 'var(--foreground-subtle)',
        },
        // Legacy support
        background: 'var(--background)',
        muted: 'var(--foreground-muted)',
        accent: 'var(--accent-primary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-tertiary) 100%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(0, 212, 255, 0.4)',
        'glow-lg': '0 0 50px rgba(0, 212, 255, 0.5)',
        'glow-cyan': '0 0 30px rgba(0, 212, 255, 0.4)',
        'glow-purple': '0 0 30px rgba(123, 47, 247, 0.4)',
        'glow-pink': '0 0 30px rgba(255, 46, 151, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.2)',
        'dark': '0 4px 12px -1px rgba(0, 0, 0, 0.5), 0 2px 8px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 12px 32px -3px rgba(0, 0, 0, 0.6), 0 4px 16px -2px rgba(0, 0, 0, 0.4)',
        'dark-xl': '0 24px 48px -5px rgba(0, 0, 0, 0.7), 0 10px 24px -5px rgba(0, 0, 0, 0.5)',
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'skeleton': 'skeleton 1.4s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'glow': 'glow 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config
