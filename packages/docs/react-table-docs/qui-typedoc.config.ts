import type {BuildOptions} from "@qualcomm-ui/typedoc"

export default {
  documentationScope: "all",
  moduleWhitelist: [
    "@qualcomm-ui/react",
    "@qualcomm-ui/react-core",
    "@qualcomm-ui/core",
    "@qualcomm-ui/dom",
    "@qualcomm-ui/qds-core",
    "@qualcomm-ui/utils",
  ],
  prettyJson: false,
  referenceLinks: {
    BindingRenderProp: "/render-props#binding-render-prop",
    RenderProp: "/render-props#render-prop",
  },
  typedocOptions: {
    gitRemote: "origin",
    gitRevision: "main",
    tsconfig: "tsconfig.typedoc.json",
  },
} satisfies BuildOptions
