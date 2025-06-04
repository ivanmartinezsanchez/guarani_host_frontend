module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3F51B5',
        'primary-dark': '#303F9F',
        secondary: '#E8EAF6',
        darkText: '#2C2C2C',
        lightText: '#9E9E9E',
        background: '#F5F5F5',
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      }
    }
  },
  plugins: [],
}
