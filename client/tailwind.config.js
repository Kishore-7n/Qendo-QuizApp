/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightYellow: "#fffced",
        darkYellow: "#fad641",
        green: "#039c56",
        darkGreen: "#1F7607",
        orange: "#d8712e",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#5C4EBF",
          secondary: "#ebebeb",
          lightYellow: "#fffced",
          darkYellow: "#fad641",
          darkGreen: "#1F7607",
          green: "#039c56",
          orange: "#d8712e",
        },
      },
      "light"
    ],
  },
}
