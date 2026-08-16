import jswPresets from '@jswork/presets-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [jswPresets()],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
};
