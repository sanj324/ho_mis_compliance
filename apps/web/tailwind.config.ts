import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6f4",
          500: "#176457",
          700: "#124a40",
          900: "#0e2f29"
        }
      },
      boxShadow: {
        panel: "0 12px 28px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
