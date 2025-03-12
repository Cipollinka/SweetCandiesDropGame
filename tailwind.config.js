/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/screens/**/*.{js,jsx,ts,tsx}',
    './src/navigation/**/*.{js,jsx,ts,tsx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
    './src/assets/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
    './src/services/**/*.{js,jsx,ts,tsx}',
    './src/types/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bordo: '#9D0001',
        customRed: '#E72D2E',
      },
    },
  },
  plugins: [],
};
