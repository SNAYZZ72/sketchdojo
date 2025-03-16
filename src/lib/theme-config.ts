// Theme configuration for the application

export const themeConfig = {
    colors: {
      primary: {
        DEFAULT: "#5667FF", // Main primary color
        light: "#7A8AFF",
        dark: "#3A4AE0"
      },
      secondary: {
        DEFAULT: "#FF56A9", // Secondary accent color
        light: "#FF7AB9",
        dark: "#E03A8A"
      },
      background: {
        DEFAULT: "#121218", // Main background
        light: "#1E1E28",
        dark: "#0A0A10"
      },
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.7)",
        muted: "rgba(255, 255, 255, 0.5)"
      }
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.15)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      glow: "0 0 15px 2px rgba(86, 103, 255, 0.5)"
    },
    gradients: {
      primary: "linear-gradient(90deg, #5667FF 0%, #FF56A9 100%)",
      hoverPrimary: "linear-gradient(90deg, #4A5AE0 0%, #E03A8A 100%)",
      background: "linear-gradient(180deg, #121218 0%, #1E1E28 100%)"
    },
    borderRadius: {
      sm: "0.25rem",
      DEFAULT: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      full: "9999px"
    },
    transitions: {
      DEFAULT: "all 0.3s ease",
      fast: "all 0.15s ease",
      slow: "all 0.5s ease"
    },
    animation: {
      DEFAULT: "0.3s ease",
      fast: "0.15s ease",
      slow: "0.5s ease"
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    }
  };
  
  // Export specific theme values for easy access
  export const colors = themeConfig.colors;
  export const shadows = themeConfig.shadows;
  export const gradients = themeConfig.gradients;
  export const borderRadius = themeConfig.borderRadius;
  export const transitions = themeConfig.transitions;
  export const animation = themeConfig.animation;
  export const fontSizes = themeConfig.fontSizes;