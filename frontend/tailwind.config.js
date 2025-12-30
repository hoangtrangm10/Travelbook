/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#003580', // Booking.com blue
          600: '#002d6b',
          700: '#002456',
          800: '#001c42',
          900: '#00132d',
        },
        accent: {
          500: '#feba02', // Booking.com yellow
          600: '#e5a702',
        }
      },
      fontFamily: {
        sans: ['BlinkMacSystemFont', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
