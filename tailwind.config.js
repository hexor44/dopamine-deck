/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        deck: { bg: '#0f0a1f', card: '#1c1535', accent: '#a78bfa', hot: '#f472b6', ok: '#34d399' },
      },
    },
  },
  plugins: [],
}
