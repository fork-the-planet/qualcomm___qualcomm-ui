import {defineConfig} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        cli: "./src/cli.ts",
        index: "./src/index.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: {
        banner: [
          `import {createRequire} from "node:module";`,
          `const require=createRequire(import.meta.url);`,
        ].join(""),
        entryFileNames: "[name].js",
        minify: {
          mangle: {
            keepNames: true,
          },
        },
      },
      platform: "node",
    },
    sourcemap: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        ...["docs-plugin", "angular-demo-plugin", "react-demo-plugin"].map(
          (plugin) => ({
            dest: "",
            rename: {stripBase: 1},
            src: `src/${plugin}/virtual.d.ts`,
          }),
        ),
      ],
    }),
  ],
})
