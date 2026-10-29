import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#FAF6F1",
          100: "#F0E6D6",
          200: "#E0CCAD",
          300: "#CCA876",
          400: "#B38A5C",
          500: "#8B6F47",
          600: "#725A3A",
          700: "#5A462D",
          800: "#423321",
          900: "#2B2116",
          DEFAULT: "#8B6F47",
        },
        accent: {
          50: "#EDF7F7",
          100: "#D4EDED",
          200: "#A8DBDB",
          300: "#6BBFBF",
          400: "#3F9E9E",
          500: "#2A6F6F",
          600: "#225B5B",
          700: "#1A4747",
          800: "#133434",
          900: "#0D2222",
          DEFAULT: "#2A6F6F",
        },
        neutral: {
          50: "#FAFAF8",
          100: "#F5F5F0",
          200: "#E8E8E0",
          300: "#D4D4CC",
          400: "#A8A89E",
          500: "#737369",
          600: "#5C5C52",
          700: "#45453D",
          800: "#2E2E28",
          900: "#1A1A16",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "0.875rem" }],
        "display-sm": ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "display-md": ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "3.5rem", fontWeight: "700" }],
        "display-xl": ["3.75rem", { lineHeight: "4.25rem", fontWeight: "800" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
