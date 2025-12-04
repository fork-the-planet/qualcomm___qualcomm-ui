import {
  Bell,
  CircleUser,
  CreditCard,
  LayoutDashboard,
  Network,
  ShieldCheck,
  User,
} from "lucide-angular"

import {createTreeCollection} from "@qualcomm-ui/core/tree"

export interface SideNavItem {
  group?: string
  icon?: string
  id: string
  nodes?: SideNavItem[]
  text: string
}

export const collection = createTreeCollection<SideNavItem>({
  nodeChildren: "nodes",
  nodeText: (node) => node.text,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        icon: "Bell",
        id: "notifications",
        text: "Notifications",
      },
      {
        icon: "LayoutDashboard",
        id: "dashboard",
        text: "Dashboard",
      },
      {
        icon: "Network",
        id: "ai-studio",
        text: "AI Studio",
      },
      {
        icon: "CircleUser",
        id: "account",
        nodes: [
          {
            icon: "User",
            id: "profile",
            text: "Profile",
          },
          {
            icon: "ShieldCheck",
            id: "security",
            text: "Security",
          },
          {
            icon: "CreditCard",
            id: "billing",
            text: "Billing",
          },
        ],
        text: "Account",
      },
    ],
    text: "",
  },
})

export const icons = {
  Bell,
  CircleUser,
  CreditCard,
  LayoutDashboard,
  Network,
  ShieldCheck,
  User,
}
