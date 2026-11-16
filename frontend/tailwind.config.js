/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        orange: "var(--orange)",
        cyan: "var(--cyan)",
        lime: "var(--lime)",
        pink: "var(--pink)",
        white: "var(--white)",
        muted: "var(--muted)",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
