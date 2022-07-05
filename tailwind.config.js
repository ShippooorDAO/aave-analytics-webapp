const daisyui = require('daisyui');

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui, require('@tailwindcss/typography')],
  daisyui: {
    themes: ['dark', 'light'],
  }
};

