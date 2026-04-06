/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hive: {
          base:    '#07090f',
          nav:     '#0b0f1a',
          panel:   '#0c1018',
          elevated:'#101520',
          hover:   '#141d2e',
          active:  '#192338',
          border:  '#1a2438',
          border2: '#223050',
        },
        teal:   '#2dd4bf',
        violet: '#8b5cf6',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
