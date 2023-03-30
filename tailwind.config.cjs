/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#7C5DFA",
        light_purple: "#9277FF",
        dark_Navy: "#1E2139",
        navy: "#252945",
        selago: "#DFE3FA",
        gray: "#888EB0",
        light_blue: "#7E88C3",
        coal: "#0C0E16",
        danger: "#EC5757",
        danger_hover: "#FF9797",
        snow: "#F8F8FB",
        very_dark_navy: "#141625"
      },

    },
  },
  plugins: [],
};

module.exports = config;
