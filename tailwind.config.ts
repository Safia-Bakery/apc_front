module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        mainGray: "#f5f5f5",
        tableSuccess: "#90ee90",
        tableWarn: "#fff49eb0",
        tableDanger: "#f5c6cb",
        darkGray: "#EDECEC",
        black: "#303031",
        darkYellow: "#FFDC4C",
        yellow: "#FFE15B",
        primary: "#447df7",
        darkBlue: "#5266F7",
        hoverGray: "#C2C2C2",
        danger: "#FA444F",
        success: "#C9E7A3",
        rejected: "#FFBEBE",
        tgPrimary: "#DCC38B",
        tgSelected: "#AAC57F",
        tgTextGray: "#898989",
        tgBorder: "#F1F1F1",
        selected: "rgba(0, 0, 0, 0.51)",
        tgGray: "#C3D2DC",
        link: "#007bff",
        invHeader: "#BEA087",
        invBtn: "#DCC38B",
      },
      boxShadow: {
        selected: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },

  plugins: [],
};
