// @ts-check
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index',
      fileName: 'index',
      formats: ['es'],
    },
    target: 'esnext',
  },
  test: {
    setupFiles: 'test/nodeWasmFetch.js',
  }
});

