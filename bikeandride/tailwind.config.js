/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        chart: {
          1: "hsl(12 76% 61%)",
          2: "hsl(173 58% 39%)",
          3: "hsl(197 37% 24%)",
          4: "hsl(43 74% 66%)",
          5: "hsl(27 87% 67%)",
        },
      },
    },
  },
  plugins: [],
}