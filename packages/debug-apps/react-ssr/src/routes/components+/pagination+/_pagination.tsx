import {PaginationControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-controlled-state-demo"
import {PaginationMetadataDemo as MetadataDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-metadata-demo"
import {PaginationPageSizeDemo as PageSizeDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-page-size-demo"
import {PaginationRangesDemo as RangesDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-ranges-demo"
import {PaginationShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-showcase-demo"
import {PaginationSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/pagination+/demos/pagination-sizes-demo"

const demos = [
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: MetadataDemo, title: "Metadata"},
  {component: PageSizeDemo, title: "Page Size"},
  {component: RangesDemo, title: "Ranges"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
]

export default function PaginationDemos() {
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
