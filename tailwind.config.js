/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "web3-purple": "#7c3aed",
        "web3-blue": "#2563eb",
        "web3-cyan": "#06b6d4",
        "web3-dark": "#0f0f1a",
        "web3-card": "#1a1a2e",
        "web3-border": "#2d2d4e",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { boxShadow: "0 0 5px #7c3aed, 0 0 10px #7c3aed" },
          to: { boxShadow: "0 0 20px #7c3aed, 0 0 40px #7c3aed" },
        },
      },
    },
  },
  plugins: [],
};
