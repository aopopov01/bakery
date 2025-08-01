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
          'warm': '#f59e0b',
          'sweet': '#ec4899',
          'fresh': '#10b981',
          'cool': '#3b82f6'
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