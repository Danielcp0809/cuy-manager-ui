import { mode } from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    brand: {
      100: "#FFE5CC",
      200: "#FFC299",
      300: "#FF9966",
      400: "#FF7733",
      500: "#F09005",  // Color base
      600: "#CC7304",
      700: "#995602",
      800: "#663801",
      900: "#331C00",
    },
    brandScheme: {
      100: "#FFE5CC",
      200: "#FF7733",
      300: "#FF7733",
      400: "#FF7733",
      500: "#F09005",
      600: "#CC7304",
      700: "#995602",
      800: "#663801",
      900: "#331C00",
    },
    brandTabs: {
      100: "#FFE5CC",
      200: "#FF9966",
      300: "#FF9966",
      400: "#FF9966",
      500: "#F09005",
      600: "#CC7304",
      700: "#995602",
      800: "#663801",
      900: "#331C00",
    },
    // Otros colores no cambian, pero puedes ajustarlos según necesites
    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    // Otros colores...
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "navy.900")(props),
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "DM Sans",
      },
    }),
  },
};
