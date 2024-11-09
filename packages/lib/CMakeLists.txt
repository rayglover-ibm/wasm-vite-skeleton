cmake_minimum_required (VERSION 3.10)

message (STATUS "Build type: ${CMAKE_BUILD_TYPE}")
project (wasi-helloworld)

set (CMAKE_CXX_STANDARD 23)
set (CMAKE_CXX_STANDARD_REQUIRED ON)
set (CMAKE_EXECUTABLE_SUFFIX_CXX .wasm)

set (SOURCES
  "./src/hello.cc"
)

add_executable (${PROJECT_NAME} ${SOURCES})

target_compile_options (${PROJECT_NAME} PUBLIC
  -Wall
  -Wextra
  -pedantic
  -fno-exceptions
  -fno-rtti
  -fcolor-diagnostics
  -msimd128

  $<$<CONFIG:Release>: -O3 -ffast-math -flto>
  $<$<CONFIG:Debug>: -O0 -g -fno-omit-frame-pointer>
)

target_compile_definitions (${PROJECT_NAME} PUBLIC
  $<$<CONFIG:Debug>: _LIBCPP_ENABLE_ASSERTIONS=1>
)

target_link_options (${PROJECT_NAME} PUBLIC

  "SHELL:
  --no-entry
  -s FILESYSTEM=0
  -s ERROR_ON_UNDEFINED_SYMBOLS=0
  -s ALLOW_MEMORY_GROWTH=1
  -s INITIAL_MEMORY=512kb
  -s MAXIMUM_MEMORY=128mb
  -s EXPORTED_FUNCTIONS='[\"_malloc\",\"_free\"]'
  -s STANDALONE_WASM=1
  -s WASM_BIGINT=1
  -s ASSERTIONS=1
  "

  # Uncomment when using address sanitizer
  # "SHELL: $<$<CONFIG:Debug>: -s INITIAL_MEMORY=16mb>"

  # split debug info
  $<$<CONFIG:Debug>:
    -gdwarf-5
    -gseparate-dwarf=$<TARGET_FILE:${PROJECT_NAME}>.dwp
  >

  # Embed an absolute file:/// URI to debug info. This works for
  # VSCode "WebAssembly DWARF Debugging" extension, but doesn't
  # by default in chrome "C/C++ DevTools Support (DWARF)" (v0.2.5854.1)
  "SHELL:
    $<$<CONFIG:Debug>:
      -s SEPARATE_DWARF_URL='file:///$<TARGET_FILE:${PROJECT_NAME}>.dwp'
    >
  "

  $<$<CONFIG:Release>: -Wl,--strip-all -flto>
)

# Generate a symlink to the .wasm referenced by the package.json
add_custom_target (link ALL
  COMMENT "Configuring #wasi-helloworld.wasm"
  COMMAND ${CMAKE_COMMAND} -E create_symlink
    $<TARGET_FILE:${PROJECT_NAME}>
    ${CMAKE_CURRENT_BINARY_DIR}/$<TARGET_FILE_NAME:${PROJECT_NAME}>
)

add_dependencies(link ${PROJECT_NAME})
