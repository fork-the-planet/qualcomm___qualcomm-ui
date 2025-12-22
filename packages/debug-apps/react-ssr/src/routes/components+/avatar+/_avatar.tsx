import {AvatarContentDemo as ContentDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-content-demo"
import {AvatarShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-showcase-demo"
import {AvatarSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-size-demo"
import {AvatarStateCallbackDemo as StateCallbackDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-state-callback-demo"
import {AvatarStatusDemo as StatusDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-status-demo"
import {AvatarVariantDemo as VariantDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-variant-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ContentDemo, title: "Content"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizeDemo, title: "Size"},
  {component: StateCallbackDemo, title: "State Callback"},
  {component: StatusDemo, title: "Status"},
  {component: VariantDemo, title: "Variant"},
]

export default function AvatarDemos() {
  return <DemoPageLayout componentName="avatar" demos={demos} />
}
