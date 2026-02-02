// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   // We're using the 'class' strategy for dark mode.
//   // This means we'll toggle a 'dark' class on the <html> element.
//   darkMode: 'class',
//   theme: {
//     extend: {
//       fontFamily: {
//         // Sets 'Inter' as the default sans-serif font for the project.
//         sans: ['Inter', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Correctly enables class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom color palette for a true black theme
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b', // A very dark gray, almost black
        }
      }
    },
  },
  plugins: [],
}

