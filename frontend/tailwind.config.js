import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'jet-black': '#2d3142',
        'blue-slate': '#4f5d75',
        silver: '#bfc0c0',
        'coral-glow': '#ef8354',
        primary: {
          DEFAULT: '#ef8354',
          hover: '#e06d3a',
          light: '#f5a882',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef8354',
          600: '#e06d3a',
          700: '#dc2626',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        bg: {
          DEFAULT: '#ffffff',
          secondary: '#f8f9fa',
          dark: '#2d3142'
        },
        txt: {
          DEFAULT: '#2d3142',
          secondary: '#4f5d75',
          muted: '#bfc0c0',
          light: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#ef8354',
              foreground: '#ffffff'
            },
            background: '#f8f9fa',
            foreground: '#2d3142',
            default: {
              DEFAULT: '#ffffff',
              foreground: '#2d3142'
            },
            secondary: {
              DEFAULT: '#4f5d75',
              foreground: '#ffffff'
            },
            success: {
              DEFAULT: '#22c55e',
              foreground: '#ffffff'
            },
            warning: {
              DEFAULT: '#f59e0b',
              foreground: '#ffffff'
            },
            danger: {
              DEFAULT: '#ef4444',
              foreground: '#ffffff'
            }
          }
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#ef8354',
              foreground: '#ffffff'
            },
            background: '#2d3142',
            foreground: '#ffffff',
            default: {
              DEFAULT: '#4f5d75',
              foreground: '#ffffff'
            },
            secondary: {
              DEFAULT: '#4f5d75',
              foreground: '#ffffff'
            }
          }
        }
      }
    })
  ]
};
