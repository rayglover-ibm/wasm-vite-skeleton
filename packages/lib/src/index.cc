#include <span>
#include "./util.h"

int WASM_IMPORT(js, getValue) getValue(void);

std::int64_t WASM_EXPORT(multiply) multiply(int a) {
  int value = getValue();
  debug_println("multiply({}x{})", value, a);

  return value * a;
}

std::int32_t WASM_EXPORT(sumi32) sumi32(const int32_t* ptr, int32_t len) {
  debug_println("sumi32({}, {})", static_cast<const void*>(ptr), len);
  std::span<const int32_t> xs(ptr, len);

  std::int32_t sum = 0;
  for (std::int32_t x : xs) sum += x;
  return sum;
}
