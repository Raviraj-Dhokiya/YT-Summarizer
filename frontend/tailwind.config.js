/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      colors: {
        bg: {
          dark: '#0f0f0f',
          light: '#f5f5f5',
        },
        surface: {
          dark: '#1a1a1a',
          light: '#ffffff',
        },
        surface2: {
          dark: '#242424',
          light: '#f0f0f0',
        },
        border: {
          dark: '#2e2e2e',
          light: '#e0e0e0',
        },
        border2: {
          dark: '#3a3a3a',
          light: '#d0d0d0',
        },
        accent: {
          dark: '#ff4444',
          light: '#e00000',
        },
        text1: {
          dark: '#f0f0f0',
          light: '#111111',
        },
        text2: {
          dark: '#909090',
          light: '#555555',
        },
        text3: {
          dark: '#555555',
          light: '#999999',
        },
        red: {
          yt: '#ff4444',
          light: '#cc0000',
        },
        green: {
          yt: '#34d058',
          light: '#1a7a3c',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease forwards',
        'spin-fast': 'spin 0.7s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-800px 0' },
          '100%': { backgroundPosition: '800px 0' },
        },
      },
    },
  },
  plugins: [],
}
