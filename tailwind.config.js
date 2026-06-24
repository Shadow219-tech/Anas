/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#c9a84c',
        'gold-light': '#f0e0a0',
        'gold-dark': '#a07830',
        'black-1': '#080808',
        'black-2': '#0d0d0d',
        'black-3': '#141414',
        'black-4': '#1a1a1a',
        'gray-1': '#555555',
        'gray-2': '#2a2a2a',
        'gray-3': '#888888',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.bg-gradient-radial': {
          background: 'radial-gradient(var(--tw-gradient-stops))',
        },
      });
    },
  ],
};
