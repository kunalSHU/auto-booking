/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "backgroundbackground-3": "var(--backgroundbackground-3)",
        "textparagraph-1": "var(--textparagraph-1)",
      },
      fontFamily: {
        caption: "var(--caption-font-family)",
        link: "var(--link-font-family)",
      },
    },
  },
  plugins: [],
};
