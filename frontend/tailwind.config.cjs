/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      
      colors: {
        ink: "#0b0f1a",
        cloud: "#f7f7fb",
        accent: "#ff7a00",
        mint: "#2bd4a4",
        ocean: "#1f6feb",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
