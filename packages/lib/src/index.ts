import { TinyWASI } from 'tinywasi';
import init from '#wasi-helloworld.wasm?init';

export interface API extends WebAssembly.Exports {
  multiply(a: number): bigint
}

export interface Instance<T extends WebAssembly.Exports> extends WebAssembly.Instance {
  exports: T;
}

const emscriptenImports = {
  env: {
    segfault() {
      throw new Error('segfault')
    },

    alignfault() {
      throw new Error('alignfault')
    },

    proc_exit(code: number) {
      throw new Error(`proc exit: ${code}`);
    },

    /**
     * Called when memory has grown. In a JS runtime, this is used to know when
     * to update the JS views on the Wasm memory, which otherwise we would need
     * to constantly check for after any Wasm code runs.
     */
    emscripten_notify_memory_growth(_memoryIndex: number) {
      console.info("MEMORY GROWN")
    },
  },
}

export async function initialize(): Promise<Instance<API>> {
  const tinywasi = new TinyWASI(false /* trace */);

  const imports = {
    js: {
      getValue: () => 7,
    },
    ...emscriptenImports,
    ...tinywasi.imports,
  };

  const instance = (await init(imports)) as Instance<API>;

  tinywasi.initialize(instance);

  return instance;
}
