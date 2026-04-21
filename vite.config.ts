import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'backend/App/wwwroot'),
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
      '/gamehub': {
        target: 'http://localhost:5001',
        ws: true // Turns on websockets
      }
    }
  },
});
