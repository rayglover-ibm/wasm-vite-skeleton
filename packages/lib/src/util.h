#pragma once

#include <chrono>
#include <print>
#include <format>

/** Utility macro to export function to JavaScript. */
#define WASM_EXPORT(name) __attribute__((export_name(#name)))

/** Utility macro to import function from JavaScript. */
#define WASM_IMPORT(module, name) __attribute__((import_module(#module), import_name(#name)))

/** Debug-only std::println(...) */
template <typename... Args>
void debug_println(std::format_string<Args...> fmt, Args&&... args) {
#ifndef NDEBUG
  std::print("[DEBUG {:%H:%M:%S}] ", std::chrono::system_clock::now());
  std::println(fmt, std::forward<Args>(args)...);
#endif
}

