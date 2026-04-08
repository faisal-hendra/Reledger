import path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@common': resolve('src/common'),
      },
    },
    build: {
      rollupOptions: {
        external: ['better-sqlite3'],
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        '@common': resolve('src/common'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve('src/common'),
        '@': path.resolve(__dirname, 'src/renderer/src'),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
