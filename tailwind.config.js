/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f5',
          100: '#ffe8dd',
          200: '#ffcfb8',
          300: '#ffab87',
          400: '#ff7d4a',
          500: '#FF6B35',
          600: '#e84d15',
          700: '#c23a0d',
          800: '#9e2f10',
          900: '#7d2511',
        },
        navy: {
          50: '#f0f0f8',
          100: '#d8d8ee',
          200: '#b0b0dc',
          300: '#7878c0',
          400: '#4040a0',
          500: '#2a2a60',
          600: '#1f1f48',
          700: '#1a1a2e',
          800: '#14142a',
          900: '#0e0e1e',
        },
        gold: {
          400: '#ffd700',
          500: '#f0c000',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FF6B35, 0 0 10px #FF6B35' },
          '100%': { boxShadow: '0 0 20px #FF6B35, 0 0 40px #FF6B35' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
