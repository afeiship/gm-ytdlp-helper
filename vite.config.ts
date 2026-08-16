import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.google.com/']
      }
    })
  ]
});
