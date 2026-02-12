// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

const FIGMA_URL =
  "https://www.figma.com/design/G6YKSbQ5Jn83xQBRvlqe6M/Code-Connect?node-id=3566-16209"

const sharedProps = {
  heading: figma.string("heading"),
  description: figma.boolean("description", {
    true: figma.string("descriptionText"),
  }),
  emphasis: figma.enum("emphasis", {
    success: "success",
    warning: "warning",
    danger: "danger",
    neutral: "neutral",
  }),
}

// Strong variant with icon (simple API)
figma.connect(AlertBanner, FIGMA_URL, {
  variant: {variant: "strong", showIcon: true},
  props: {
    ...sharedProps,
    dismissable: figma.boolean("dismiss"),
    action: figma.boolean("button", {
      true: (
        <Button size="sm" emphasis="white-persistent">
          Button
        </Button>
      ),
    }),
  },
  example: (props) => <AlertBanner {...props} />,
})

// Strong variant without icon (composite API)
figma.connect(AlertBanner.Root, FIGMA_URL, {
  variant: {variant: "strong", showIcon: false},
  props: {
    ...sharedProps,
    dismissButton: figma.boolean("dismiss", {
      true: <AlertBanner.CloseButton />,
    }),
    action: figma.boolean("button", {
      true: (
        <Button size="sm" emphasis="white-persistent">
          Button
        </Button>
      ),
    }),
  },
  example: ({emphasis, heading, description, action, dismissButton}) => (
    <AlertBanner.Root emphasis={emphasis}>
      <AlertBanner.Heading>{heading}</AlertBanner.Heading>
      <AlertBanner.Description>{description}</AlertBanner.Description>
      <AlertBanner.ActionContainer>{action}</AlertBanner.ActionContainer>
      {dismissButton}
    </AlertBanner.Root>
  ),
})

// Subtle variant with icon (simple API)
figma.connect(AlertBanner, FIGMA_URL, {
  variant: {variant: "subtle", showIcon: true},
  props: {
    ...sharedProps,
    variant: "subtle",
    dismissable: figma.boolean("dismiss"),
    action: figma.boolean("button", {
      true: (
        <Button size="sm" emphasis="neutral" variant="outline">
          Button
        </Button>
      ),
    }),
  },
  example: (props) => <AlertBanner {...props} />,
})

// Subtle variant without icon (composite API)
figma.connect(AlertBanner.Root, FIGMA_URL, {
  variant: {variant: "subtle", showIcon: false},
  props: {
    ...sharedProps,
    variant: "subtle",
    dismissButton: figma.boolean("dismiss", {
      true: <AlertBanner.CloseButton />,
    }),
    action: figma.boolean("button", {
      true: (
        <Button size="sm" emphasis="neutral" variant="outline">
          Button
        </Button>
      ),
    }),
  },
  example: ({emphasis, heading, description, action, dismissButton}) => (
    <AlertBanner.Root emphasis={emphasis} variant="subtle">
      <AlertBanner.Heading>{heading}</AlertBanner.Heading>
      <AlertBanner.Description>{description}</AlertBanner.Description>
      <AlertBanner.ActionContainer>{action}</AlertBanner.ActionContainer>
      {dismissButton}
    </AlertBanner.Root>
  ),
})
