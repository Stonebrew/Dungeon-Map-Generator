/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#ece4d4',
        ink: '#1f1a15',
        ember: '#a65335',
        moss: '#667a65',
        brass: '#c18453',
        slatewood: '#476a67',
        dossier: '#fff9ec',
        fieldcase: '#172326',
      },
      boxShadow: {
        tool: '0 12px 28px rgba(31, 26, 21, 0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'Aptos', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['LOKI', 'Classica Prestige', 'Vectis', 'Cormorant Garamond', 'Libre Baskerville', 'Palatino Linotype', 'Book Antiqua', 'Georgia', 'ui-serif', 'serif'],
        label: ['Aptos', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Aptos Mono', 'Cascadia Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
