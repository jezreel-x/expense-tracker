// Design tokens. Components reference these rather than hard-coded values,
// so the look can be changed in one place.
//
// The scales below are shared; only `colors` and `shadows` differ between
// light and dark, which keeps the two palettes structurally identical and
// means no component needs to know which one is active.

const scales = {
  // 4px base scale
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px"
  },

  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    pill: "999px"
  },

  typography: {
    family:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    size: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "20px",
      xl: "26px",
      "2xl": "34px"
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5
    }
  },

  breakpoints: {
    sm: "480px",
    md: "768px"
  }
};

const lightColors = {
  background: "#F4F5F7",
  surface: "#FFFFFF",
  surfaceMuted: "#F9FAFB",

  border: "#E5E7EB",
  borderStrong: "#D1D5DB",

  text: "#111827",
  textMuted: "#6B7280",
  textSubtle: "#9CA3AF",
  textInverse: "#FFFFFF",

  accent: "#4F46E5",
  accentHover: "#4338CA",
  accentSoft: "#EEF2FF",

  positive: "#047857",
  positiveSoft: "#ECFDF5",
  negative: "#B91C1C",
  negativeSoft: "#FEF2F2",

  focusRing: "rgba(79, 70, 229, 0.35)"
};

// Not a mechanical inversion: on a dark ground the accent and the
// positive/negative hues are lightened so they stay legible, and the soft
// fills become deep tints rather than pale washes.
const darkColors = {
  background: "#0F1115",
  surface: "#171A21",
  surfaceMuted: "#1E222B",

  border: "#2A2F3A",
  borderStrong: "#3A4150",

  text: "#E8EAED",
  textMuted: "#9BA3AF",
  textSubtle: "#6B7280",
  textInverse: "#0F1115",

  accent: "#818CF8",
  accentHover: "#A5B4FC",
  accentSoft: "#1E1B4B",

  positive: "#34D399",
  positiveSoft: "#0A2A20",
  negative: "#F87171",
  negativeSoft: "#2C1517",

  focusRing: "rgba(129, 140, 248, 0.45)"
};

const lightShadows = {
  sm: "0 1px 2px rgba(16, 24, 40, 0.05)",
  md: "0 4px 12px rgba(16, 24, 40, 0.08)",
  lg: "0 12px 32px rgba(16, 24, 40, 0.12)"
};

// Shadows read as almost nothing on a dark ground, so they are deepened.
const darkShadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 4px 12px rgba(0, 0, 0, 0.5)",
  lg: "0 12px 32px rgba(0, 0, 0, 0.6)"
};

export const lightTheme = {
  ...scales,
  mode: "light",
  colors: lightColors,
  shadows: lightShadows
};

export const darkTheme = {
  ...scales,
  mode: "dark",
  colors: darkColors,
  shadows: darkShadows
};

export const getTheme = (mode) => (mode === "dark" ? darkTheme : lightTheme);

export default lightTheme;
