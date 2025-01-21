/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8740',
        secondary: '#FDE49C',
        accent: '#640C6F',
      },
      borderRadius: {const theme = createTheme({
        palette: {
          primary: {
            main: '#FF6F61',
          },
          secondary: {
            main: '#6D6D6D',
          },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
      });
      
        'lg': '12px',
      },
    },
  },
  plugins: [],
};
