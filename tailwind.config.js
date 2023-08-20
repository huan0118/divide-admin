/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-black': '#313534',
        'regal-grey': '#8b6b5b',
      },
    },
  },
  plugins: [],
}
