#include <iostream>
#include <chrono>

/** Utility macros to import and export function from/to JavaScript. */
#define WASM_EXPORT(name) __attribute__((export_name(#name)))
#define WASM_IMPORT(module, name) __attribute__((import_module(#module), import_name(#name)))

int WASM_IMPORT(js, getValue) getValue(void);

/**
 * Multiplies a user supplied value with an imported value. Returns an int64
 * (a bigint on the JavaScript side)
 */
std::int64_t WASM_EXPORT(multiply) multiply(int a) {
  int value = getValue();

#ifndef NDEBUG
  std::cout << std::format("[DEBUG {:%d-%m-%Y %T}]", std::chrono::system_clock::now())
            << std::format(" multiply({}x{})\n", value, a);
#endif

  return value * a;
}
