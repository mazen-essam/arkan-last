/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
        fontFamily: {
        sans: ['Mulish', 'sans-serif'], // Default font
        almarai: ['Almarai', 'sans-serif'], // For Arabic
        poppins: ['Poppins', 'sans-serif'], // For Poppins
        inter: ['Inter', 'sans-serif'], // For Inter
      },
    },
  },
  plugins: [],
};
