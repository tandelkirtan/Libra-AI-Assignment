/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d0e12',
          card: '#1a1c23',
          border: '#262933',
          muted: '#9ca3af',
        },
        brand: {
          purple: '#8b5cf6',
          green: '#10b981',
          blue: '#3b82f6',
          orange: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
