export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#D4AF37', light: '#F0C862', dark: '#A37F1D' },
        secondary: { DEFAULT: '#140F08', 800: '#0F0904', 700: '#1a1510' },
        accent: { DEFAULT: '#F3E9D2', dark: '#CDBA99' },
        luxury: { DEFAULT: '#251D15', 800: '#1C1510', 700: '#3A2E20' },
      },
      boxShadow: {
        luxury: '0 14px 35px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};