/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'throne': {
          'black': '#000000',
          'red': '#E53935',
          'yellow': '#FDD835',
          'green': '#43A047',
          'blue': '#1E88E5',
          'gray': '#9E9E9E',
          'lightgray': '#F5F5F5'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
