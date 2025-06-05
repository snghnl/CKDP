import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { makeEntryPointPlugin } from '@extension/hmr';
import { withPageConfig } from '@extension/vite-config';
import { IS_DEV } from '@extension/env';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/content-ui',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.tsx'),
      },
      output: {
        entryFileNames: 'index.iife.js',
        format: 'iife',
        name: 'contentUI',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        inlineDynamicImports: true
      },
      external: ['react', 'react-dom']
    }
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src')
    }
  }
});
