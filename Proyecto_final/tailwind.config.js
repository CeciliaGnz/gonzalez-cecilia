// tailwind.config.js

// Importa la configuración de Tailwind CSS
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./frontend/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
