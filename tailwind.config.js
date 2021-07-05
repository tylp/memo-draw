module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}', 
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      blue: {
        'darker-blue': '#004063',
        'blue': '#006DBB',
        'light-blue': '#00BAE3',
        'lighter-blue': '#33C5F5',
      },
      black: {
        'black': '#000000'
      },
      grey: {
        'grey': '#4D4D4D',
      },
      pink: {
        'dark-pink': '#ED1E79',
        'light-pink': '#FF7BAC',
      },
      yellow: {
        'dark-yellow': '#CCAC0F',
        'light-yellow': '#FFE500',
      },
      white: {
        'white': '#FFFFFF'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
