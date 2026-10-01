import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0d14",
        surface: "#111726",
        "surface-light": "#1a2238",
        border: "#232d4b",
        brand: {
          netflix: "#E50914",
          spotify: "#1DB954",
          prime: "#00A8E1",
          youtube: "#FF0000",
          disney: "#113CCF",
          max: "#7B2CBF",
          canva: "#00C4CC",
          gold: "#F59E0B",
          accent: "#6366F1",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
