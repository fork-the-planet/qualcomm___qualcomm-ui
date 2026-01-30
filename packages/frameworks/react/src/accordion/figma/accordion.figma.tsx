// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsAccordionSize} from "@qualcomm-ui/qds-core/accordion"
import {Accordion} from "@qualcomm-ui/react/accordion"

/** Accordion Group */

const sharedGroupProps = {
  children: figma.children("Accordion"),
  size: figma.enum<QdsAccordionSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
  uncontained: figma.enum("contained", {
    false: true,
  }),
}

// Accordion group
figma.connect(Accordion.Root, "<FIGMA_COMPONENTS_BASE>?node-id=2191-5476", {
  example: ({children, size, uncontained}) => {
    return (
      <Accordion.Root size={size} uncontained={uncontained}>
        {/* Each item requires a unique value */}
        {children}
      </Accordion.Root>
    )
  },
  props: {
    ...sharedGroupProps,
  },
})

/** Accordion Item */

const sharedItemProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
}

figma.connect(Accordion.Item, "<FIGMA_COMPONENTS_BASE>?node-id=2161-18192", {
  example: ({disabled, icon, secondaryText}) => {
    return (
      <Accordion.Item
        disabled={disabled}
        icon={icon}
        secondaryText={secondaryText}
        text="Title of accordion"
        value=""
      >
        Lorem Ipsum
      </Accordion.Item>
    )
  },
  imports: ["import {SomeIcon} from 'lucide-react'"],
  props: {
    ...sharedItemProps,
    icon: figma.boolean("icon", {
      false: undefined,
      true: SomeIcon,
    }),
    secondaryText: figma.boolean("subHeader", {
      false: undefined,
      true: "Secondary text",
    }),
  },
  variant: {
    chevron: "right",
  },
})

figma.connect(Accordion.Item, "<FIGMA_COMPONENTS_BASE>?node-id=2161-18192", {
  example: ({disabled, secondaryText}) => {
    return (
      <Accordion.ItemRoot disabled={disabled} value="">
        <Accordion.ItemTrigger>
          <Accordion.ItemIndicator />
          <Accordion.ItemText>Title of accordion</Accordion.ItemText>
          {secondaryText}
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>Lorem Ipsum</Accordion.ItemContent>
      </Accordion.ItemRoot>
    )
  },
  props: {
    ...sharedItemProps,
    secondaryText: figma.boolean("subHeader", {
      false: undefined,
      true: (
        <Accordion.ItemSecondaryText>
          Secondary text
        </Accordion.ItemSecondaryText>
      ),
    }),
  },
  variant: {
    chevron: "left",
  },
})
