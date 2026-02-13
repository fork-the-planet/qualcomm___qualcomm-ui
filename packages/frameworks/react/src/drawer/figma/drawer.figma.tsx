// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsDrawerSize} from "@qualcomm-ui/qds-core/drawer"
import {Button} from "@qualcomm-ui/react/button"
import {Drawer} from "@qualcomm-ui/react/drawer"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=10872-1658"

figma.connect(Drawer.Root, FIGMA_URL, {
  example: ({
    closeButton,
    description,
    footer,
    formPlaceholder,
    heading,
    indicatorIcon,
    size,
  }) => (
    <Drawer.Root defaultOpen size={size}>
      <Drawer.FloatingPortal>
        <Drawer.Body>
          {indicatorIcon}
          {closeButton}
          {heading}
          {description}
          {formPlaceholder}
        </Drawer.Body>
        {footer}
      </Drawer.FloatingPortal>
    </Drawer.Root>
  ),
  props: {
    closeButton: figma.boolean("dismiss", {
      true: <Drawer.CloseButton />,
    }),
    description: figma.boolean("description", {
      true: <Drawer.Description>Lorem Ipsum</Drawer.Description>,
    }),
    footer: figma.boolean("buttonGroup", {
      true: (
        <Drawer.Footer>
          <Drawer.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Drawer.CloseTrigger>
          <Drawer.CloseTrigger>
            <Button emphasis="primary">Button</Button>
          </Drawer.CloseTrigger>
        </Drawer.Footer>
      ),
    }),
    formPlaceholder: figma.enum("variant", {
      form: "{/* Form content goes here */}",
    }),
    heading: figma.boolean("heading", {
      true: <Drawer.Heading>Heading</Drawer.Heading>,
    }),
    indicatorIcon: figma.boolean("icon", {
      true: <Drawer.IndicatorIcon />,
    }),
    size: figma.enum<QdsDrawerSize>("size", {
      md: "md",
    }),
  },
})
