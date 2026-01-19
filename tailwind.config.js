/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Fondos y Neutros (Inspirado en cuevas y rocas)
        background: "#1A1C22",
        surface: "#2D303E",
        surfaceLight: "#3E4251",
        white: "#FFFFFF",
        cream: "#FFF4E0", // Un blanco cálido para que no canse la vista

        // Colores de Marca (Extraídos del logo)
        mainRed: "#FF5959",
        darkRed: "#C31432",
        shadowRed: "#7B0000",
        mainRose: "#FF2E95",
        darkRose: "#BC005B",
        mainPurple: "#9D4EDD",
        darkPurple: "#5A189A",
        limeGreen: "#A2D729",
        shadowGreen: "#1B5E20",
        neonRose: "#FF2E95",
        gold: "#FFD600",
        shadowPurple: "#240046",
        cian: "#00D2FF",
        seaBlue: "#00457C",

        // Estados (Versión Gamer)
        success: "#A2D729", // Verde brillante
        error: "#FF4D4D", // Rojo vibrante
        warning: "#FFC800", // Amarillo oro

        // Grises de soporte
        textMain: "#FFFFFF",
        textMuted: "#94959B",
        border: "#4A4D57",
      },
      fontFamily: {
        CairoBlack: ["CairoBlack", "sans-serif"],
        CairoBold: ["CairoBold", "sans-serif"],
        CairoSemiBold: ["CairoSemiBold", "sans-serif"],
        CairoRegular: ["CairoRegular", "sans-serif"],
        CairoLight: ["CairoLight", "sans-serif"],
        CairoExtraLight: ["CairoExtraLight", "sans-serif"],
      },
      screens: {
        xs: "500px",
      },
      boxShadow: {
        card: "0px 1px 3px 1px rgba(0, 0, 0, 1), 0px 1px 2px 0px rgba(0, 0, 0, 0.8)",
        filterCard: "0px 1px 4px 0px rgba(0, 102, 255, 0.5)",
      },
    },
  },
  plugins: [],
};
