// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {Rocket} from "lucide-react"

import type {QdsSideNavSurface} from "@qualcomm-ui/qds-core/side-nav"
import {SideNav} from "@qualcomm-ui/react/side-nav"

const SIDENAV_URL = "<FIGMA_COMPONENTS_BASE>?node-id=14492-51514"
const MENU_ITEM_URL = "<FIGMA_COMPONENTS_BASE>?node-id=14834-655454"

const sharedProps = {
  surface: figma.enum<QdsSideNavSurface>("surface", {
    secondary: "secondary",
  }),
}

/** SideNav Root - Expanded */

figma.connect(SideNav.Root, SIDENAV_URL, {
  example: ({surface}) => (
    <SideNav.Root
      collection={collection}
      defaultExpandedValue={["analytics"]}
      defaultSelectedValue={["dashboard"]}
      surface={surface}
    >
      <SideNav.Header>
        <SideNav.HeaderLogo>{/* Logo */}</SideNav.HeaderLogo>
        <SideNav.HeaderTitle>App Name</SideNav.HeaderTitle>
      </SideNav.Header>

      <SideNav.Group>
        <SideNav.Divider />
        <SideNav.GroupLabel>Group Title</SideNav.GroupLabel>
        {/* SideNav.Nodes or individual nodes */}
      </SideNav.Group>
    </SideNav.Root>
  ),
  props: sharedProps,
  variant: {
    variant: "expanded",
  },
})

/** SideNav Root - Collapsed */

figma.connect(SideNav.Root, SIDENAV_URL, {
  example: ({surface}) => (
    <SideNav.Root collection={collection} open={false} surface={surface}>
      <SideNav.Header>
        <SideNav.HeaderLogo>{/* Logo */}</SideNav.HeaderLogo>
        <SideNav.HeaderTitle>App Name</SideNav.HeaderTitle>
        <SideNav.CollapseTrigger />
      </SideNav.Header>

      <SideNav.Group>
        <SideNav.Divider />
        <SideNav.GroupLabel>Group Title</SideNav.GroupLabel>
        {/* SideNav.Nodes or individual nodes */}
      </SideNav.Group>
    </SideNav.Root>
  ),
  props: sharedProps,
  variant: {
    variant: "collapsed",
  },
})

/** Menu Item - Default (LeafNode) */

figma.connect(SideNav.LeafNode, MENU_ITEM_URL, {
  example: () => (
    <SideNav.LeafNode>
      <SideNav.NodeIndicator />
      <SideNav.NodeIcon icon={Rocket} />
      <SideNav.NodeText>Menu item</SideNav.NodeText>
    </SideNav.LeafNode>
  ),
  variant: {
    variant: "default",
  },
})

/** Menu Item - Dropdown (Branch) */

figma.connect(SideNav.Branch, MENU_ITEM_URL, {
  example: () => (
    <SideNav.Branch>
      <SideNav.BranchNode>
        <SideNav.NodeIndicator />
        <SideNav.NodeIcon icon={Rocket} />
        <SideNav.NodeText>Menu item</SideNav.NodeText>
        <SideNav.BranchTrigger />
      </SideNav.BranchNode>
      <SideNav.BranchContent>{/* Child nodes */}</SideNav.BranchContent>
    </SideNav.Branch>
  ),
  variant: {
    variant: "dropdown",
  },
})
