import { resolve } from 'node:path';
import fs from 'fs';
import path from 'path';
import { defineConfig, type PluginOption } from 'vite';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './utils/plugins/make-manifest-plugin.js';
import { watchPublicPlugin, watchRebuildPlugin } from '@extension/hmr';
import { watchOption } from '@extension/vite-config';
import env, { IS_DEV, IS_PROD } from '@extension/env';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');
const outDir = resolve(rootDir, '..', 'dist');

// ✅ entry 등록
const backgroundEntry = resolve(srcDir, 'background', 'index.ts');
const backgroundInputName = 'background';

const chartDetectorEntry = resolve(rootDir, '..', 'pages', 'content', 'src', 'chart-detector.ts');
const chartDetectorInputName = 'chartDetector';
const chartDetectorOutputPath = 'content/chart-detector.js';

export default defineConfig({
  define: {
    'process.env': env,
  },
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    libAssetsPlugin({
      outputPath: outDir,
    }) as PluginOption,
    watchPublicPlugin(),
    makeManifestPlugin({ outDir }),
    IS_DEV && watchRebuildPlugin({ reload: true, id: 'chrome-extension-hmr' }),
    nodePolyfills(),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: IS_DEV,
    minify: IS_PROD,
    reportCompressedSize: IS_PROD,
    watch: watchOption,
    rollupOptions: {
      external: ['chrome'],
      input: {
        [backgroundInputName]: backgroundEntry,
        [chartDetectorInputName]: chartDetectorEntry,
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === chartDetectorInputName) {
            return chartDetectorOutputPath;
          }
          return '[name].js'; // background는 그대로 background.js
        },
      },
    },
  },
});