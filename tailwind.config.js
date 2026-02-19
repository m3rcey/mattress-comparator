/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a2e',
          purple: '#6366f1',
          pink: '#ec4899',
        }
      }
    },
  },
  plugins: [],
}
