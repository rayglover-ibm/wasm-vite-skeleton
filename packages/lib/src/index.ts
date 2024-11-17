import * as wasm from './uscripten.js';
import lib from '#wasi-lib.wasm?init';

export interface ExampleAPI extends wasm.EmscriptenExports {
  multiply(n: number): bigint;
}

export async function initialize() {
  const imports = {
    js: {
      getValue: () => 7,
    },
  }
  return wasm.initialize<ExampleAPI>(lib, imports);
}
