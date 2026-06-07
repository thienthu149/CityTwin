import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// City Twin runs fully client-side for the hackathon demo — no backend required.
// (An optional Express/Claude backend lives in server.js + api/, run via `npm run dev:full`.)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
