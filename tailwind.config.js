/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        prim: { DEFAULT: '#10b981', dark: '#059669' },
        accent: { DEFAULT: '#f59e0b', dark: '#d97706' },
      },
    },
  },
  plugins: [],
}
