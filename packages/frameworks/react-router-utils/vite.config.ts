import {defineConfig} from "vite"

import {dependenciesToExternal, libraryEntriesPlugin} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    lib: {
      entry: {},
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: [
        {
          minify: {
            mangle: {
              keepNames: true,
            },
          },
        },
      ],
    },
    sourcemap: true,
  },
  plugins: [libraryEntriesPlugin()],
})
