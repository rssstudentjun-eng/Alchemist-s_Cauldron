import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Alchemist-s_Cauldron/',
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
