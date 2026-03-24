export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6B35', light: '#FF8C5A', dark: '#E5521A' },
        dark: { DEFAULT: '#1A1A2E', 800: '#16213E', 700: '#0F3460' },
      },
    },
  },
  plugins: [],
};