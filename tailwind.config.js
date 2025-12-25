/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'light-gold': '#F4E4BC',
        'soft-white': '#FAF9F6',
        'dark-text': '#2C2C2C',
        'accent-purple': '#8A6F9D',
        'ultra-dark': '#0a0a0f',
        'ultra-purple': '#a855f7',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
