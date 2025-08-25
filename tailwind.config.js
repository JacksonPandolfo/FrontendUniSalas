/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ["Roboto", "sans-serif"],
            poppins: ["Poppins", "sans-serif"],
        },
    },
  },
  plugins: [],
}