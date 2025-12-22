import {TagEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-emphasis-demo"
import {TagIconsDemo as IconsDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-icons-demo"
import {TagRadiusDemo as RadiusDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-radius-demo"
import {TagSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-sizes-demo"
import {TagStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-states-demo"
import {TagVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-variants-demo"

const demos = [
  {component: EmphasisDemo, title: "Emphasis"},
  {component: IconsDemo, title: "Icons"},
  {component: RadiusDemo, title: "Radius"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: VariantsDemo, title: "Variants"},
]

export default function TagDemos() {
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
