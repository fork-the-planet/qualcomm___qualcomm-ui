import {HeaderBarMenuItemDemo as MenuItemDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-menu-item-demo"
import {HeaderBarShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-showcase-demo"
import {HeaderBarSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-sizes-demo"
import {HeaderBarSurfacesDemo as SurfacesDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-surfaces-demo"

const demos = [
  {component: MenuItemDemo, title: "Menu Item"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
  {component: SurfacesDemo, title: "Surfaces"},
]

export default function HeaderBarDemos() {
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
