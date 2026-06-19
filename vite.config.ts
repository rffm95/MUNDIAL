import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/MUNDIAL/',
    plugins: [
      react(), 
      tailwindcss(),
      legacy({
        targets: ['chrome >= 61', 'safari >= 11', 'ios >= 11'],
      })
    ],
    build: {
      target: 'es2015',
      cssTarget: 'chrome61',
      minify: 'esbuild', // Faster and more stable for GH Actions
      reportCompressedSize: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
