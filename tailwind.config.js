/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FFE8D3",
          200: "#FFD1A7",
          300: "#FFBA7A",
          400: "#FFA34E",
          500: "#F97316", // Base Muted Orange
          600: "#D85F12",
          700: "#B84A0E",
          800: "#98360A",
          900: "#782306",
        },
        secondary: {
          100: "#F9FAFB",
          200: "#F3F4F6",
          300: "#E5E7EB",
          400: "#D1D5DB",
          500: "#9CA3AF", // Base Light Gray
          600: "#6B7280",
          700: "#4B5563",
          800: "#374151",
          900: "#1F2937",
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
