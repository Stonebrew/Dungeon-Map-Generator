/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#f4efe5',
        ink: '#211a16',
        ember: '#b85c38',
        moss: '#64745a',
        brass: '#a7833f',
        slatewood: '#3f4d55',
      },
      boxShadow: {
        tool: '0 10px 30px rgba(33, 26, 22, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
