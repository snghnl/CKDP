import { resolve } from 'node:path';
import fs from 'fs';
import path from 'path';
import { withPageConfig } from '@extension/vite-config';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');
const outDir = resolve(rootDir, '..', '..', 'dist', 'side-panel');

// ✅ manifest.ts → manifest.json 변환
const generateManifestPlugin = {
  name: 'generate-manifest',
  apply: 'build',
  buildStart() {
    // ✅ 실제 manifest.ts 위치 (CKDP/manifest.ts)
    const manifestTsPath = resolve(rootDir, '..', '..', 'manifest.ts');
    const distManifestPath = resolve(rootDir, '..', '..', 'dist', 'manifest.json');

    // 동적으로 TypeScript 모듈 import (ESM 방식)
    import(manifestTsPath).then((module) => {
      const manifest = module.default;
      fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2));
      console.log('[vite] manifest.json 생성 완료:', distManifestPath);
    }).catch((err) => {
      console.error('[vite] manifest.ts 불러오기 실패:', err);
    });
  }
};

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
  },
  plugins: [
    generateManifestPlugin
  ]
});