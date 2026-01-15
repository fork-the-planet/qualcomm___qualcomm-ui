import figma from "@figma/code-connect"

import type {
  QdsDialogEmphasis,
  QdsDialogSize,
} from "@qualcomm-ui/qds-core/dialog"
import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=8157-32610"

const sharedProps = {
  closeButton: figma.boolean("dismiss", {
    true: <Dialog.CloseButton />,
  }),
  description: figma.boolean("description", {
    true: <Dialog.Description>Lorem Ipsum</Dialog.Description>,
  }),
  formPlaceholder: figma.enum("variant", {
    form: "{/* Form content goes here */}",
  }),
  heading: figma.boolean("heading", {
    true: <Dialog.Heading>Dialog heading</Dialog.Heading>,
  }),
  indicatorIcon: figma.boolean("icon", {
    true: <Dialog.IndicatorIcon />,
  }),
  size: figma.enum<QdsDialogSize>("size", {
    md: "md",
  }),
}

// Non-danger variants (info, success, warning, neutral)
figma.connect(Dialog.Root, FIGMA_URL, {
  example: ({
    closeButton,
    description,
    emphasis,
    footer,
    formPlaceholder,
    heading,
    indicatorIcon,
    size,
  }) => (
    <Dialog.Root defaultOpen emphasis={emphasis} size={size}>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          {indicatorIcon}
          {closeButton}
          {heading}
          {description}
          {formPlaceholder}
        </Dialog.Body>
        {footer}
      </Dialog.FloatingPortal>
    </Dialog.Root>
  ),
  props: {
    ...sharedProps,
    emphasis: figma.enum<QdsDialogEmphasis>("emphasis", {
      info: "info",
      neutral: "neutral",
      success: "success",
      warning: "warning",
    }),
    footer: figma.boolean("buttonGroup", {
      true: (
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button emphasis="primary">Button</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      ),
    }),
  },
})

// Danger emphasis variant - uses danger button for destructive actions.
figma.connect(Dialog.Root, FIGMA_URL, {
  example: ({
    closeButton,
    description,
    footer,
    formPlaceholder,
    heading,
    indicatorIcon,
    size,
  }) => (
    // For destructive confirmations, consider adding role="alertdialog"
    // to improve accessibility for screen readers.
    <Dialog.Root defaultOpen emphasis="danger" size={size}>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          {indicatorIcon}
          {closeButton}
          {heading}
          {description}
          {formPlaceholder}
        </Dialog.Body>
        {footer}
      </Dialog.FloatingPortal>
    </Dialog.Root>
  ),
  props: {
    ...sharedProps,
    footer: figma.boolean("buttonGroup", {
      true: (
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button emphasis="danger">Button</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      ),
    }),
  },
  variant: {
    emphasis: "danger",
  },
})
