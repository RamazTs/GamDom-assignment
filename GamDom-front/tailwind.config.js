/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orange: {
          400: "#FF8C00", // Vibrant orange
          500: "#FF7F00", // Slightly darker orange for button
        },
      },
    },
  },
  plugins: [],
};
