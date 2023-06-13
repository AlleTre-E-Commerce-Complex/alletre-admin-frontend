module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "821px",
      // => @media (min-width: 768px) { ... }
      l: "1150px",
      // => @media (min-width: 768px) { ... }
      lg: "1440px",
      // => @media (min-width: 1025px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serifAR: ["Cairo"],
      serifEN: ["Roboto"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ["Almarai"],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#FEFEFE",
          gray: "#ACACAC1A",
          profile: "#E5E5E51A",
        },
        primary: {
          DEFAULT: "#821A4D",
          dark: "#62143A",
          light: "#A2547A",
          veryLight: "#EAE2E6",
        },
        secondary: {
          DEFAULT: "#00134F",
          light: "#B9BDCD",
          veryLight: "#00134F1A",
        },
        gray: {
          DEFAULT: "#6F6F6F",
          verydark: "#515151",
          dark: "#707070",
          med: "#ACACAC",
          light: "#F9F9F9",
          veryLight: "#E5E5E5",
        },
        red: {
          DEFAULT: "#E40909",
          dark: "#731C1C",
        },
        green: {
          DEFAULT: "#45BF55",
          light: "#D9F1DC",
        },
        cyan: {
          DEFAULT: "#67C6B9",
        },
        yellow: {
          DEFAULT: "#FBAE4C",
          light: "#FFEDD6",
        },
        orang: {
          DEFAULT: "#EB8400",
        },
      },
      dropShadow: {
        "home-img": "0px 3px 16px #E9E9E980",
        "3xl": "0px 1px 4px #E9E9E9B3",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
