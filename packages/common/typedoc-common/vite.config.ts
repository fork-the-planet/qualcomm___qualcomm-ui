import {defineConfig} from "vite"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [...(await dependenciesToExternal()), /^@qualcomm-ui\//],
      output: {
        minify: {
          mangle: {
            keepNames: true,
          },
        },
      },
    },
    sourcemap: true,
  },
})
