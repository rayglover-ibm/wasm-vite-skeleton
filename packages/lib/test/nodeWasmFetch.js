import fs from "node:fs/promises";
import path from "node:path";

const builtinFetch = fetch;

/**
 * The vite wasm plugin is browser-only.
 * Override fetch() to perform local .wasm file load Node.js.
 */
globalThis.fetch = async (url, init) => {
  if (typeof url === "string" && url.endsWith(".wasm?init")) {
    try {
      new URL(url);
    } catch {
      const filePath = path.join(process.cwd(), url.replace(/\?init$/, ""));

      return new Response(await fs.readFile(filePath), {
        headers: { "Content-Type": "application/wasm" },
      });
    }
  }

  return builtinFetch(url, init);
};
