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
        primary: '#4EC5C1', // Mint
        secondary: '#1A3C40', // Dark Teal
        dark: {
          bg: '#0F172A', // Rich Navy/Slate (Dark Mode Harmony)
          card: '#1E293B',
          text: '#F1F5F9'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(78, 197, 193, 0.3)', // Soft Mint Glow
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}