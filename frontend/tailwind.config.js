/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0455BF",     // Azul fuerte
        secondary: "#0477BF",   // Azul vibrante
        accent: "#4375D9",      // Azul medio
        soft: "#899DD9",        // Azul lavanda
        light: "#B0B6D9"        // Azul claro
      },
    },
  },
  plugins: [],
}

