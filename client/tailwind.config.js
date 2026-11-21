/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefcf9',
          100: '#fdf7f1', // Main base background from artdiarium
          200: '#f6ede4',
          300: '#eadfd9',
          400: '#dfc9b8',
        },
        raspberry: {
          50: '#fcf2f6',
          100: '#f8e4ed',
          200: '#f2cadb',
          300: '#e7a3c0',
          400: '#d7729d',
          500: '#b0456f', // Artdiarium primary accent
          600: '#9d355f',
          700: '#83284e',
          800: '#6d2341',
          900: '#5c2039',
        },
        plum: {
          50: '#f6f5f5',
          100: '#ece9ea',
          200: '#dcd5d8',
          300: '#c3b7bc',
          400: '#a4939b',
          500: '#88747e',
          600: '#6e5a60', // Artdiarium muted text
          700: '#5b494f',
          800: '#4c3c41',
          900: '#3d2c33', // Artdiarium deep plum dark
        },
        sheet: {
          peach: '#f6dcb0',
          lilac: '#d4b0e4',
          pink: '#f4c6d6',
          blue: '#c4e4f6',
        },
        // Backward-compatibility aliases for terracotta and charcoal
        terracotta: {
          50: '#fcf2f6',
          100: '#f8e4ed',
          200: '#f2cadb',
          300: '#e7a3c0',
          400: '#d7729d',
          500: '#b0456f',
          600: '#9d355f',
          700: '#83284e',
          800: '#6d2341',
          900: '#5c2039',
        },
        charcoal: {
          50: '#f6f5f5',
          100: '#ece9ea',
          200: '#dcd5d8',
          300: '#c3b7bc',
          400: '#a4939b',
          500: '#88747e',
          600: '#6e5a60',
          700: '#5b494f',
          800: '#4c3c41',
          900: '#3d2c33',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5eee7',
          200: '#cdddc0',
          500: '#6d9378',
          600: '#55775f',
        },
        amber: {
          50: '#fdf9f0',
          500: '#d4973b',
          600: '#b97f2c',
        },
        rose: {
          50: '#fdf4f4',
          500: '#c95d63',
          600: '#b04b51',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        handwriting: ['"Pinyon Script"', 'cursive'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(61, 44, 51, 0.08)',
        'soft-hover': '0 16px 36px -6px rgba(61, 44, 51, 0.16)',
        'card': '0 4px 20px -2px rgba(61, 44, 51, 0.06)',
        'art-plum': '4px 4px 0px #d4b0e4',
        'art-raspberry': '4px 4px 0px #f6dcb0',
        'art-white': '4px 4px 0px #f4c6d6',
        'art-stage': '0 30px 60px -25px rgba(61, 44, 51, 0.28)',
      }
    },
  },
  plugins: [],
}
