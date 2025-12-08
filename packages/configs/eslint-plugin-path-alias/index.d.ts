import type {ConfigObject} from "@eslint/core"
import type {ESLint} from "eslint"

interface EslintPluginPathAlias {
  configs: {
    /**
     * Configuration for projects
     */
    recommended: ConfigObject
  }
  plugin: ESLint.Plugin
  rules: ESLint.Plugin["rules"]
}

declare const defaultExport: EslintPluginPathAlias
export default defaultExport
