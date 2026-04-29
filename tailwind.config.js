/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAFAF7',
          200: '#F5F3EE',
          300: '#EDE9E0',
        },
        sage: {
          100: '#E8EDE6',
          200: '#C8D9C3',
          400: '#85B07A',
          600: '#4A7A42',
          800: '#2D5228',
        },
        lavender: {
          100: '#EBE8F5',
          200: '#CFC9EC',
          400: '#9B8FD9',
          600: '#6B5EC7',
          800: '#3E3480',
        },
        amber: {
          100: '#FDF0DC',
          200: '#FAD99A',
          400: '#F0A830',
          600: '#C07A10',
          800: '#7A4D08',
        },
        rose: {
          100: '#F9E8E8',
          200: '#F0BFBF',
          400: '#D97070',
          600: '#B84040',
          800: '#7A2020',
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        checkFill: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pixelReveal: {
          '0%': { opacity: '0', letterSpacing: '0.5em', filter: 'blur(4px)' },
          '60%': { opacity: '1', letterSpacing: '0.3em', filter: 'blur(0)' },
          '100%': { opacity: '1', letterSpacing: '0.25em', filter: 'blur(0)' },
        },
        flame: {
          '0%, 100%': { transform: 'scaleY(1) rotate(-2deg)' },
          '50%': { transform: 'scaleY(1.1) rotate(2deg)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
        pixelReveal: 'pixelReveal 1.2s ease-out forwards',
        flame: 'flame 1.5s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        cardHover: '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
        sage: '0 4px 16px rgba(74,122,66,0.2)',
        lavender: '0 4px 16px rgba(107,94,199,0.2)',
      },
    },
  },
  plugins: [],
}
