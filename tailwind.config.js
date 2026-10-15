/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        sage: v('sage'),
        mist: v('mist'),
        warm: v('warm'),
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
      },
      keyframes: {
        breathe: { '0%,100%': { transform: 'scale(1)', opacity: '0.55' }, '50%': { transform: 'scale(1.06)', opacity: '0.9' } },
      },
      animation: { breathe: 'breathe 8s ease-in-out infinite' },
    },
  },
  plugins: [],
}
