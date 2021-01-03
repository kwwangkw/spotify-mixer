const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
    }),
    textColor: theme => ({
      ...theme('colors'),
    }),
    extend: {
      colors: {
        "spotify-gray": '#222326',
        "dark-gray": '#121212',
        "primary": colors.emerald,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
