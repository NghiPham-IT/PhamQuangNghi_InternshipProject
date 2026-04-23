/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dt-pink": "#e91e63", // Màu hồng sen
        "dt-green": "#2e7d32", // Màu xanh rừng tràm
      },
    },
  },
  plugins: [],
};
