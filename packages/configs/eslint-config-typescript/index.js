import base from "./base.js"
import jsdoc from "./jsdoc.js"
import namingConventions from "./naming-conventions.js"
import sortKeys from "./sort-keys.js"
import strictExports from "./strict-exports.js"
import styleGuide from "./style-guide.js"
import typeChecks from "./type-checks.js"

const [baseConfig] = base
const [namingConventionsConfig] = namingConventions
const [sortKeysConfig] = sortKeys
const [styleGuideConfig] = styleGuide
const [typeChecksConfig] = typeChecks

const recommended = {
  languageOptions: baseConfig.languageOptions,
  name: "qui-typescript-recommended",
  plugins: {
    ...baseConfig.plugins,
    ...styleGuideConfig.plugins,
    ...sortKeysConfig.plugins,
  },
  rules: {
    ...styleGuideConfig.rules,
    ...sortKeysConfig.rules,
    ...typeChecksConfig.rules,
    ...namingConventionsConfig.rules,
  },
}

export default {
  configs: {
    base,
    jsdoc,
    namingConventions,
    recommended,
    sortKeys,
    strictExports,
    styleGuide,
    typeChecks,
  },
}
