import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        teal: {
          DEFAULT: "#0d9488",
          light: "#14b8a6",
          dark: "#0f766e",
          dim: "#ccfbf1",
        },
      },
    },
  },
  plugins: [],
};
export default config;
