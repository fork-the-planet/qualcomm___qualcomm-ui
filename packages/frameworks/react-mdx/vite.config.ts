import babel from "@rolldown/plugin-babel"
import react, {reactCompilerPreset} from "@vitejs/plugin-react"
import {defineConfig} from "vite"

import {
  dependenciesToExternal,
  libraryEntriesPlugin,
  packagesToExternal,
} from "@qualcomm-ui/vite"

import pkg from "./package.json"

export default defineConfig({
  build: {
    lib: {
      entry: {},
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        ...packagesToExternal(Object.keys(pkg.peerDependencies)),
        ...packagesToExternal(Object.keys(pkg.optionalDependencies)),
        /^@qualcomm-ui\//,
      ],
      output: {
        banner: `"use client;"`,
        entryFileNames: "[name].js",
        minify: {
          mangle: {
            keepNames: true,
          },
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    libraryEntriesPlugin(),
  ],
})
