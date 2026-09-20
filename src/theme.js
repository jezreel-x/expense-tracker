// Design tokens. Components should reference these rather than hard-coded
// values, so the look can be changed in one place.

const theme = {
  colors: {
    // Surfaces
    background: "#F4F5F7",
    surface: "#FFFFFF",
    surfaceMuted: "#F9FAFB",

    // Lines
    border: "#E5E7EB",
    borderStrong: "#D1D5DB",

    // Text
    text: "#111827",
    textMuted: "#6B7280",
    textSubtle: "#9CA3AF",
    textInverse: "#FFFFFF",

    // Primary action
    accent: "#4F46E5",
    accentHover: "#4338CA",
    accentSoft: "#EEF2FF",

    // Money in / money out
    positive: "#047857",
    positiveSoft: "#ECFDF5",
    negative: "#B91C1C",
    negativeSoft: "#FEF2F2",

    focusRing: "rgba(79, 70, 229, 0.35)"
  },

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

  shadows: {
    sm: "0 1px 2px rgba(16, 24, 40, 0.05)",
    md: "0 4px 12px rgba(16, 24, 40, 0.08)",
    lg: "0 12px 32px rgba(16, 24, 40, 0.12)"
  },

  typography: {
    family:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    // Numeric readout (balances, amounts) — tabular figures keep columns aligned.
    familyNumeric:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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

export default theme;
