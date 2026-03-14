// @ts-check
import pkg from './package.json';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [dts({ outDir: './build/dts' })],
  build: {
    lib: {
      entry: './src/index',
      fileName: 'index',
      formats: ['es'],
    },
    target: 'esnext',
    rollupOptions: {
      plugins: [
        {
          // watch entries in package.imports
          name: 'watch-imports',
          buildStart() {
            for (const path of Object.values(pkg.imports)) {
              this.addWatchFile(path);
            }
          },
        },
      ],
    },
  }
});
