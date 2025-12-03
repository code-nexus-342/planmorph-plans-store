/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        architect: {
          900: '#1a1a1a', // Rich Black
          800: '#2d2d2d', // Dark Gray
          700: '#4a4a4a', // Medium Gray
          600: '#717171', // Light Gray
          500: '#9e9e9e', // Lighter Gray
          100: '#f5f5f5', // Off White
          50: '#fafafa',  // Almost White
        },
        accent: {
          gold: '#c5a059',
          teal: '#2d6a6a',
        },
        // Keeping some legacy names mapped to new colors for compatibility during refactor
        nebula: {
          900: '#ffffff', // Background becomes white
          800: '#f5f5f5', // Secondary background
          700: '#e5e5e5', // Borders/Separators
        },
        neon: {
          cyan: '#2d6a6a', // Mapped to teal
          purple: '#c5a059', // Mapped to gold
          magenta: '#1a1a1a', // Mapped to black
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.9)',
          200: 'rgba(0, 0, 0, 0.05)',
          300: 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.04)',
        'float': '0 20px 40px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
