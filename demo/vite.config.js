import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3006,
    host: true,
    open: false,
    strictPort: true,
  },
  resolve: {
    alias: {
      '/dist/': '../dist/',
    },
  },
});
