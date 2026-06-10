import type {ConfigObject} from "@eslint/core"

interface TypescriptConfigExport {
  configs: {
    /**
     * Base TypeScript configuration with parser and plugin setup.
     * Required for each config to work.
     */
    base: ConfigObject

    /**
     * JSDoc validation rules (alignment, tag names, formatting).
     * Use for code with public APIs or documentation requirements.
     */
    jsdoc: ConfigObject

    /**
     * TypeScript naming conventions (PascalCase for types, camelCase for
     * properties, etc). Requires type information.
     */
    namingConventions: ConfigObject

    /**
     * Recommended TypeScript configuration. This includes the settings from the
     * `base`, `styleGuide`, `sortKeys`, `typeChecks`, and
     * `namingConventions` configs. This rule requires type information, which can
     * be provided via `languageOptions`. An example configuration is available below:
     *
     * Usage:
     *
     * @example
     * ```js
     * // eslint.config.js
     * import {defineConfig} from "eslint/config"
     * import tseslint from "typescript-eslint"
     * import quiEslintTs from "@qualcomm-ui/eslint-config-typescript"
     *
     * export default defineConfig(
     *  {
     *    // other settings
     *  },
     *  {
     *    extends: [quiEslintTs.configs.recommended],
     *    files: [/*TS Files*\/],
     *    languageOptions: {
     *      parser: tseslint.parser,
     *      parserOptions: {
     *        projectService: true,
     *      },
     *    }
     *  },
     * )
     * ```
     */
    recommended: ConfigObject

    /**
     * Sort object properties, interface members, and type definitions
     * alphabetically.
     */
    sortKeys: ConfigObject

    /**
     * Enforce explicit type exports for public APIs (prevents runtime bloat).
     * Use for library entry points and public exports.
     */
    strictExports: ConfigObject

    /**
     * Code style rules (imports, formatting, unused code, etc).
     * Enforces oxfmt, import ordering, and code quality standards.
     */
    styleGuide: ConfigObject

    /**
     * Type-aware linting rules (await-thenable, no-unsafe-call, etc).
     * Requires TypeScript type information. Catches type-related bugs.
     */
    typeChecks: ConfigObject
  }
}

declare const typescriptConfig: TypescriptConfigExport
export default typescriptConfig
