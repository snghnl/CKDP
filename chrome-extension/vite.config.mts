import { resolve } from 'node:path';
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
      input: {
        background: resolve(srcDir, 'background', 'index.ts'),
        chartDetector: resolve(rootDir, '..', 'pages/content/src/chart-detector.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'chartDetector') {
            return 'pages/content/src/chart-detector.js';
          }
          if (chunkInfo.name === 'background') {
            return 'src/background/index.js'; // ✅ 수정된 경로
          }
          return 'src/[name].js';
        },
      },
      external: ['chrome'],
    },
  },
});
