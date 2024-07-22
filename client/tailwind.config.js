/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "5/4": "5 / 4",
        "5/3": "5 / 3",
      },
      padding: {
        6: "1.5",
      },
      keyframes: {
        fadeUp: {
          "0%": { transform: "translateY(-20%)", opacity: 0 },
          "100%": { transform: "translateY(0%)", opacity: 1},
        },
        zoomIn: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1},
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-in-out 1",
        zoomIn: "zoomIn 0.4s ease-in-out 1",
      },
      
    },
  },
  // ...
  plugins: [
    // ...
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
