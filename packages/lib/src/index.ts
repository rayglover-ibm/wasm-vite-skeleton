import * as wasm from './uscripten.js';
import lib from '#wasi-lib.wasm?init';

export interface ExampleAPI extends wasm.EmscriptenExports {
  /**
   * Multiplies the given value with an imported value provided by getValue().
   * Returns an int64 (a bigint on the JavaScript side)
   */
  multiply(n: number): bigint;

  /** Returns the sum of values in the given range. */
  sumi32(ptr: wasm.Ptr<'i32'>, elements: number): number;
}

export async function initialize() {
  const imports = {
    js: {
      getValue: () => 7,
    },
  }
  return wasm.initialize<ExampleAPI>(lib, imports);
}
