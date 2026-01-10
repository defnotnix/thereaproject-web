export const configThemeMantineMain: any = {
  // * COLORS & SHADES
  colors: {
    brand: [
      "#fdf4f3", // 50
      "#fbeae8", // 100
      "#f6d7d5", // 200
      "#efb6b2", // 300
      "#e58b87", // 400
      "#d75f5c", // 500
      "#c13d40", // 600
      "#a72f35", // 700
      "#882931", // 800
      "#75262f", // 900
      "#411014", // 950
    ],
  },
  primaryColor: "brand",
  primaryShade: {
    light: 6,
    dark: 5,
  },
  autoContrast: true,
  luminanceThreshold: 0.5,

  white: "#ffffff",
  black: "#000000",

  // * FONTS
  fontFamily: `"Stack Sans Headline", sans-serif`,
  fontSmoothing: true,

  headings: {
    fontFamily: `"Stack Sans Headline", sans-serif`,
    sizes: {
      h1: { fontSize: "36" },
    },
  },
};
