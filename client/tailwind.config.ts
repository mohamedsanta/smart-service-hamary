import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5ecd9',
        'cream-deep': '#ede0c4',
        sand: '#d9c59a',
        terracotta: '#b04a2a',
        'terracotta-dark': '#8a3519',
        rust: '#6b2712',
        ochre: '#c88a3d',
        ink: '#231712',
        'ink-soft': '#4a342a',
        'gold-accent': '#d4a24a',
        success: '#4a6b3a',
        line: '#c7b38a',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
        kufi: ['"Noto Kufi Arabic"', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(35,23,18,0.3) 0%, rgba(35,23,18,0.7) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
