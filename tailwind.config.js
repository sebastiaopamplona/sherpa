/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "catpuccin-pink-1": "#ECC0E4",
        "catpuccin-pink-1-dark": "#762367",
        "catpuccin-orange-1": "#E29DA1",
        "catpuccin-orange-1-dark": "#762327",
        "catpuccin-yellow-1": "#EAD4A5",
        "catpuccin-yellow-1-dark": "#7c5e1d",
        "catpuccin-blue-1": "#90ADEE",
        "catpuccin-blue-1-dark": "#153884",
        "catpuccin-blue-2": "#9FD5E1",
        "catpuccin-blue-2-dark": "#256674",
        "catpuccin-blue-3": "#c7d0f2",
        "catpuccin-blue-3-dark": "#1d327c",
        "catpuccin-green-1": "#B1D89C",
        "catpuccin-green-1-dark": "#436d2c",
        "catpuccin-purple-1": "#bfa3f0",
        "catpuccin-purple-1-dark": "#3e1584",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
