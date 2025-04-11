/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./common/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "main-white": "#F2F2F2",
        "main-rose": "#FF6969",
        "main-rose-light": "#FFA0A0",
        "main-gray": "#6B645D",
        "main-yellow": "#FFCB2D",
        "main-rose-dark": "#CC4C4C",
        "main-gray-dark": "#4F4A45",
      },
      fontFamily: {
        "montserrat-r": ["Montserrat-r"],
        "montserrat-sb": ["Montserrat-sb"],
        "montserrat-b": ["Montserrat-b"],
      },
    },
  },
  plugins: [],
};
