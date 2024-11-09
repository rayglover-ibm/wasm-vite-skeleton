# (Node/Browser) Emscripten + Vite skeleton lib/app
### This skeleton monorepo demonstrates:

#### An isomorphic (Node/browser) JS/Wasm package with a minimal browser-compatible WASI implementation.
- This WASI runtime supports basic io/clock/random APIs and should be sufficient for most needs. This means the runtime overhead is <1KB minified JS.
- See [packages/lib](./packages/lib)

#### Running tests in Nodejs with Vitest
- The WASM can be debugged within VSCode with the [WebAssembly DWARF Debugging](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wasm-dwarf-debugging) extension. The (potentially large) about of debug information is split in to a separate DWARF package (.dwp), reducing build times and other overheads.

#### Consuming the library in a Vite browser app
- The WASM can be debugged with the Chrome [C/C++ DevTools Support (DWARF)](https://chromewebstore.google.com/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb) extension, again with a separate DWARF package (dwp).
- See [src/main.ts](./src/main.ts)

### Dev environment

- Clone the repo
- Install CMake (3.17+) and Ninja
- Install the Emscripten SDK. Make sure your `EMSCRIPTEN_SDK_PATH` environment variable is configured correctly.
- `pnpm install` - Installs packages and configures the CMake project in the `lib` package and compiles a binary in debug mode.
- `pnpm dev` - Starts the vite dev server in dev mode
- `pnpm build` - Builds a distribution for each package. The `lib` package is recompiled in Release mode.

### Libraries/Tools/SDKs Used

- Emscripten
- Node.js, TypeScript 
- Vite, Vitest
- CMake, Ninja, Clang

<br>

-----

### FAQ

#### _In chrome I get an error when debugging:_
```
[C/C++ DevTools Support (DWARF)] Failed to load debug symbols for http://localhost:5173/packages/lib/build/native/Debug/wasi-lib.wasm?init (TypeError: Failed to fetch)
```
The `.dwp` (which contains the debug symbols) is referenced by the `.wasm` as a `file:///` scheme URI, which by default can't be loaded by extensions in recent version of Chrome.

To enable this, you must locate the extension on your machine, open the manifest.json and add `"file:///*"` to the `host_permissions` field:

```
"host_permissions": [ "http://*/*", "https://*/*", "file:///*" ],
```

Finally, load this as an unpacked extension, and restart the browser.