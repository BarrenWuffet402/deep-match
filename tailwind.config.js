/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d1a',
        surface: '#14142a',
        border: '#1e1e35',
        'border-light': '#2e2e4a',
        muted: '#1e1e35',
        text: '#e8e0d5',
        subtle: '#9b95a3',
        gold: '#c9a96e',
        'gold-dark': '#b8924f',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
