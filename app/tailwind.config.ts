import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        XY: { raw: '(hover: hover)' },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      colors: {
        'dark-void': '#131518',
      },
    },
  },
  plugins: [],
} satisfies Config
