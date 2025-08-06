/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'bulgarian': ['Inter', 'DejaVu Sans', 'Liberation Sans', 'sans-serif'],
        'display': ['Comfortaa', 'Inter', 'sans-serif']
      },
      colors: {
        'storefront': {
          'deep-green': '#1a4a3a',
          'rich-green': '#2d5a47',
          'sage': '#4a6b5c',
          'forest': '#164339',
          'gold': '#d4af37',
          'warm-gold': '#e8c547',
          'rich-gold': '#b8941f',
          'bronze': '#a67c2a',
          'teal': '#4a8b8b',
          'cream': '#f8f5f0',
          'ivory': '#faf8f3',
          'pearl': '#f5f2ed',
          'champagne': '#f7f4e8'
        },
        'complement': {
          'soft-pink': '#e8d5d1',
          'blush': '#f0e6e3',
          'warm-brown': '#8b6f47',
          'cocoa': '#6b5239',
          'rose-gold': '#e8b4a0',
          'dusty-rose': '#d4a5a5'
        },
        'refined': {
          'primary': '#3a6b58',
          'secondary': '#c9a876',
          'accent': '#f7f1e8',
          'muted': '#5d8470',
          'subtle': '#e8dfc6'
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      }
    },
  },
  plugins: [],
}