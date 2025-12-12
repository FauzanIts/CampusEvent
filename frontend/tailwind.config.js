import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        modern: {
          primary: "#4f46e5",
          "primary-content": "#ffffff",
          secondary: "#0f172a",
          accent: "#22c55e",
          neutral: "#111827",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "9999px",
          "--animation-btn": "0.15s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
        },
      },
    ],
  },
}
