/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF7F2',
          200: '#F4EFEA',
          300: '#EAE2D7',
          400: '#D5C7B5',
        },
        kitchen: {
          50: '#EBF8EE',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#95D5B2',
          400: '#74C69D',
          500: '#52B788',
          600: '#40916C',
          700: '#2D6A4F',
          800: '#1B4332',
          900: '#112C20',
          950: '#0B1C14',
        },
        terracotta: {
          50: '#FDF4F2',
          100: '#F9E2DC',
          200: '#F3C5BA',
          300: '#EAA392',
          400: '#E07A5F',
          500: '#D65E40',
          600: '#BD482B',
          700: '#973821',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(27, 67, 50, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 8px 24px -4px rgba(27, 67, 50, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
