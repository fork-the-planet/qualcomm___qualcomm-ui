import {DialogAlertDialogDemo as AlertDialogDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-alert-dialog-demo"
import {DialogControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-controlled-state-demo"
import {DialogEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-emphasis-demo"
import {DialogInsideScrollDemo as InsideScrollDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-inside-scroll-demo"
import {DialogOutsideScrollDemo as OutsideScrollDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-outside-scroll-demo"
import {DialogPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-placement-demo"
import {DialogSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-sizes-demo"

const demos = [
  {component: AlertDialogDemo, title: "Alert Dialog"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: InsideScrollDemo, title: "Inside Scroll"},
  {component: OutsideScrollDemo, title: "Outside Scroll"},
  {component: PlacementDemo, title: "Placement"},
  {component: SizesDemo, title: "Sizes"},
]

export default function DialogDemos() {
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
