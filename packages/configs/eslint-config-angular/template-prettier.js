import oxfmtPlugin from "eslint-plugin-oxfmt"
import {defineConfig} from "eslint/config"

export default defineConfig({
  extends: [oxfmtPlugin.configs.recommendedWithoutParser],
  rules: {
    "oxfmt/oxfmt": "error",
  },
})
