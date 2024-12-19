/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        salmon: {
          light: "#FFA07A", // Lighter salmon
          DEFAULT: "#FA8072", // Salmon
          dark: "#E9967A", // Darker salmon
        },
      },
    },
  },
  plugins: [],
};
