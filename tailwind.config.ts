import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // ─── HIER NEU: Keyframes & Animation für Gradient-Shift ───
      keyframes: {
        // verschiebt den Hintergrund-Gradienten horizontal von 0% → 100%
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        // bindet die Keyframes in eine endlose 4s-Ease-Animation
        "gradient-shift": "gradientShift 4s ease infinite",
      },
      backgroundSize: {
        // sorgt dafür, dass der Verlauf groß genug ist, um verschoben zu werden
        "200%": "200% 200%",
      },
      // ─────────────────────────────────────────────────────────────
    },
  },
  plugins: [],
} satisfies Config;
