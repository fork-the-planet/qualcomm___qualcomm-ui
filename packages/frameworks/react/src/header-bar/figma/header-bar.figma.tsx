import figma from "@figma/code-connect"
import {Bell, Grid, Search, Settings, User} from "lucide-react"

import type {
  QdsHeaderBarSize,
  QdsHeaderSurface,
} from "@qualcomm-ui/qds-core/header-bar"
import {Avatar} from "@qualcomm-ui/react/avatar"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Menu} from "@qualcomm-ui/react/menu"

figma.connect(HeaderBar, "<FIGMA_COMPONENTS_BASE>?node-id=14622-42103", {
  example: ({logo, size, surface}) => (
    <HeaderBar.Root size={size} surface={surface}>
      <HeaderBar.Logo>{/* Logo content */}</HeaderBar.Logo>
      {logo.appTitle}
      {logo.divider}
      <HeaderBar.Nav>
        <HeaderBar.NavItem>Home</HeaderBar.NavItem>
        <HeaderBar.NavItem>Automated Jobs</HeaderBar.NavItem>
        <Menu.Root>
          <Menu.Trigger>
            <HeaderBar.MenuItem>Remote Sessions</HeaderBar.MenuItem>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="option1">Option 1</Menu.Item>
              <Menu.Item value="option2">Option 2</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
        <HeaderBar.NavItem>Minutes</HeaderBar.NavItem>
        <HeaderBar.NavItem>FAQ</HeaderBar.NavItem>
      </HeaderBar.Nav>
      <HeaderBar.ActionBar>
        <HeaderBar.ActionIconButton icon={Search} />
        <HeaderBar.Divider />
        <HeaderBar.ActionIconButton icon={Bell} />
        <HeaderBar.ActionIconButton icon={Settings} />
        <HeaderBar.ActionButton startIcon={Grid}>Apps</HeaderBar.ActionButton>
        <HeaderBar.Divider />
        <Avatar.Root size="xs" status="active" variant="contrast">
          <Avatar.Content icon={User} />
          <Avatar.Status />
        </Avatar.Root>
      </HeaderBar.ActionBar>
      <HeaderBar.WindowControls />
    </HeaderBar.Root>
  ),
  props: {
    logo: figma.nestedProps("_Header logo", {
      appTitle: figma.boolean("name", {
        true: <HeaderBar.AppTitle>Qualcomm AI Runtime</HeaderBar.AppTitle>,
      }),
      divider: figma.boolean("divider", {
        true: <HeaderBar.Divider />,
      }),
    }),
    size: figma.enum<QdsHeaderBarSize>("size", {
      lg: "lg",
    }),
    surface: figma.enum<QdsHeaderSurface>("surface", {
      secondary: "secondary",
    }),
  },
})
