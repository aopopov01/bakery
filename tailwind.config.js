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
        'bakery': {
          'emerald': '#0f4f3c',
          'forest': '#1a5c42', 
          'gold': '#d4af37',
          'cream': '#f5e6d3',
          'beige': '#e8d5b7',
          'dark-emerald': '#0a3d2e',
          'light-emerald': '#2d6b52',
          'bright-gold': '#ffd700',
          'soft-gold': '#f4e4a6'
        },
        'storefront': {
          'primary': '#0f4f3c',
          'secondary': '#d4af37',
          'accent': '#f5e6d3',
          'dark': '#0a3d2e',
          'light': '#e8d5b7'
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