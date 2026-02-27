import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {defineConfig} from "vite"
import babel from "vite-plugin-babel"
import tsconfigPaths from "vite-tsconfig-paths"

import {
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
} from "@qualcomm-ui/mdx-vite"

const ReactCompilerConfig = {}

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins()],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    babel({
      babelConfig: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        presets: ["@babel/preset-typescript"], // if you use TypeScript
      },
      filter: /\.[jt]sx?$/,
    }),
    tsconfigPaths(),
    quiDocsPlugin(),
  ],
})
