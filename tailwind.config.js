/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blackBlue: "#030F1C",
        darkBlue: "#001730",
        mainBlue: "#07074D",
        lightBlue: "#0066FF",
        creamBlue: "#65A3FF",
        softBlue: "#D6E7FF",
        softWhite: "#F3F5F8",
        seaShell : "#F1F1F1",
        midGray: "#231F20",
        textGray: "#767676",
        textMidGray: "#737373",
        borderGray: "#94959B",
        softGray: "#D8D8D8",
        lightRed: "#F35959",
        softRed: "#FCDCDC",
        midGreen: "#2AA600",
        lightGreen: "#33CC00",
        softGreen: "#E0FFD6",
        midYellow: "#E9A100",
        lightPink: "#B43DAB",
      },
      fontFamily: {
        PoppinsBold: ["PoppinsBold", "sans-serif"],
        PoppinsSemiBold: ["PoppinsSemiBold", "sans-serif"],
        PoppinsMedium: ["PoppinsMedium", "sans-serif"],
        PoppinsRegular: ["PoppinsRegular", "sans-serif"],
        PoppinsLight: ["PoppinsLight", "sans-serif"],
      },
      screens: {
        'xs': '500px',
      },
      boxShadow: {
        card: '0px 1px 3px 1px rgba(0, 0, 0, 1), 0px 1px 2px 0px rgba(0, 0, 0, 0.8)',
        filterCard: '0px 1px 4px 0px rgba(0, 102, 255, 0.5)'
      }
    },
  },
  plugins: [],
}

