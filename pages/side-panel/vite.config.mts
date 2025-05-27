import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');
const sharedDir = resolve(rootDir, '..', '..', 'packages', 'shared', 'lib'); // ✅ 'lib'까지 명시

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
      '@shared': sharedDir, // ✅ 여기서 정확하게 lib까지
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'side-panel'),
  },
});
