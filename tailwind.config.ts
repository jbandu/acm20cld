import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════
      // COLOR PALETTE - Amplitude-Inspired
      // ═══════════════════════════════════════════════════════════
      colors: {
        // Primary Colors (Purple) - Main brand color
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6", // Main primary
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          DEFAULT: "#8B5CF6",
        },
        // Secondary Colors (Blue) - Complementary
        secondary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Main secondary
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          DEFAULT: "#3B82F6",
        },
        // Accent Colors for data visualization and highlights
        accent: {
          cyan: {
            50: "#ECFEFF",
            100: "#CFFAFE",
            200: "#A5F3FC",
            300: "#67E8F9",
            400: "#22D3EE",
            500: "#06B6D4",
            600: "#0891B2",
            700: "#0E7490",
            800: "#155E75",
            900: "#164E63",
          },
          pink: {
            50: "#FDF2F8",
            100: "#FCE7F3",
            200: "#FBCFE8",
            300: "#F9A8D4",
            400: "#F472B6",
            500: "#EC4899",
            600: "#DB2777",
            700: "#BE185D",
            800: "#9D174D",
            900: "#831843",
          },
          amber: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
          },
          emerald: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
          },
          red: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            200: "#FECACA",
            300: "#FCA5A5",
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626",
            700: "#B91C1C",
            800: "#991B1B",
            900: "#7F1D1D",
          },
        },
        // Neutral Colors for text, backgrounds, borders
        neutral: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
        },
        // Chart Colors for data visualization
        chart: {
          1: "#8B5CF6", // purple
          2: "#3B82F6", // blue
          3: "#06B6D4", // cyan
          4: "#EC4899", // pink
          5: "#F59E0B", // amber
          6: "#10B981", // emerald
          7: "#EF4444", // red
          8: "#8B5CF6", // purple (repeat)
        },
      },

      // ═══════════════════════════════════════════════════════════
      // TYPOGRAPHY SYSTEM
      // ═══════════════════════════════════════════════════════════
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },

      // ═══════════════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════════════
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },

      // ═══════════════════════════════════════════════════════════
      // SHADOWS & ELEVATION
      // ═══════════════════════════════════════════════════════════
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
        // Custom purple shadow for primary elements
        primary: "0 10px 15px -3px rgb(139 92 246 / 0.1)",
        "primary-lg": "0 20px 25px -5px rgb(139 92 246 / 0.15)",
      },

      // ═══════════════════════════════════════════════════════════
      // ANIMATIONS & TRANSITIONS
      // ═══════════════════════════════════════════════════════════
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-smooth",
        "fade-out": "fade-out 250ms ease-smooth",
        "slide-up": "slide-up 250ms ease-smooth",
        "slide-down": "slide-down 250ms ease-smooth",
        "scale-in": "scale-in 150ms ease-smooth",
        shimmer: "shimmer 2s infinite linear",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      // ═══════════════════════════════════════════════════════════
      // SPACING (extending default 4px base)
      // ═══════════════════════════════════════════════════════════
      spacing: {
        18: "72px",
        22: "88px",
        26: "104px",
        30: "120px",
      },

      // ═══════════════════════════════════════════════════════════
      // BACKGROUND GRADIENTS
      // ═══════════════════════════════════════════════════════════
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
        "gradient-accent": "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
        "gradient-dark": "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
