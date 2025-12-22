import {IconButtonContrastDemo as ContrastDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-contrast-demo"
import {IconButtonDensityDemo as DensityDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-density-demo"
import {IconButtonEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-emphasis-demo"
import {IconButtonSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-sizes-demo"
import {IconButtonVariantCombinationsDemo as VariantCombinationsDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-variant-combinations-demo"
import {IconButtonVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-variants-demo"

const demos = [
  {component: ContrastDemo, title: "Contrast"},
  {component: DensityDemo, title: "Density"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: SizesDemo, title: "Sizes"},
  {component: VariantCombinationsDemo, title: "Variant Combinations"},
  {component: VariantsDemo, title: "Variants"},
]

export default function IconButtonDemos() {
  return (
    <div className="page">
      {demos.map(({component: Demo, title}) => (
        <div className="section" key={title}>
          <h2 className="section-title">{title}</h2>
          <div className="demo-container">
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
