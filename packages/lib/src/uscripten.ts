import { TinyWASI } from 'tinywasi';

type TypedArray = Uint8Array | Int8Array | Uint32Array | Int32Array | Float32Array | Float64Array;

export type PtrScalarTag = 'i8' | 'u8' | 'i32' | 'u32' | 'f32' | 'f64';

type PtrTag = PtrScalarTag | TypedArray;

type TagFromTypedArray<T extends TypedArray> =
  T extends Int8Array ? 'i8' :
  T extends Uint8Array ? 'u8' :
  T extends Int32Array ? 'i32' :
  T extends Uint32Array ? 'u32' :
  T extends Float32Array ? 'f32' :
  T extends Float64Array ? 'f64' :
  never;

type TypedArrayConstructor<T extends TypedArray> = {
  new (buffer: ArrayBuffer, offset?: number, length?: number): T;
  BYTES_PER_ELEMENT: number;
};

export type Ptr<Tag extends PtrTag = PtrTag> = number & {
  readonly __brand: unique symbol;
  readonly __tag?: Tag extends TypedArray ? TagFromTypedArray<Tag> : Tag;
};

export interface EmscriptenExports extends WebAssembly.Exports {
  readonly memory: WebAssembly.Memory;
  malloc(n: number): Ptr;
  free(ptr: Ptr): void;
  malloc_usable_size(ptr: Ptr): number;
}

export interface Instance<T extends EmscriptenExports> extends WebAssembly.Instance {
  exports: T;
}

export class MemoryUtil {
  constructor(private readonly exports: EmscriptenExports) {}

  ensureOwnership(arr: TypedArray) {
    if (arr.buffer !== this.exports.memory.buffer) throw new Error('Invalid buffer');
  }

  viewOf<T extends TypedArray>(
    ptr: Ptr<T>,
    ctor: TypedArrayConstructor<T>,
    elements: number
  ): T {
    return new ctor(this.exports.memory.buffer, ptr, elements);
  }

  newArray<T extends TypedArray>(
    ctor: TypedArrayConstructor<T>,
    elements: number
  ): T {
    return new ctor(
      this.exports.memory.buffer,
      this.exports.malloc(elements * ctor.BYTES_PER_ELEMENT),
      elements,
    );
  }

  freeArray<T extends TypedArray>(arr: T) {
    this.ensureOwnership(arr);
    this.exports.free(arr.byteOffset as Ptr<T>);
  }

  freeAll(...ptr: Ptr[]): void {
    for (let i = 0; i < ptr.length; i++) this.exports.free(ptr[i])
  }

  sizeOf(ptr: Ptr) {
    return this.exports.malloc_usable_size(ptr);
  }

  asPtr<T extends TypedArray>(arr: T): Ptr<T> {
    this.ensureOwnership(arr);
    return arr.byteOffset as Ptr<T>;
  }
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
    emscripten_notify_memory_growth(_memoryIndex: number) {},
  }
};

export async function initialize<T extends EmscriptenExports>(
  init: (options?: WebAssembly.Imports) => Promise<WebAssembly.Instance>,
  userImports?: any,
): Promise<{ exports: T, memory: MemoryUtil }> {
  const tinywasi = new TinyWASI(false /* trace */);

  const imports = {
    ...emscriptenImports,
    ...tinywasi.imports,
    ...userImports,
  };

  const instance = (await init(imports)) as Instance<T>;

  tinywasi.initialize(instance);

  const exports = instance.exports;

  return { exports, memory: new MemoryUtil(exports) };
}
