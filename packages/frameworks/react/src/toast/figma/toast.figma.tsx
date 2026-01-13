import figma from "@figma/code-connect"

import type {ToastType} from "@qualcomm-ui/core/toast"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({placement: "bottom-end"})

figma.connect(Toaster, "<FIGMA_COMPONENTS_BASE>?node-id=3485-375", {
  example: ({action, description, label, type}) => (
    <>
      {/* 1. Render <Toaster /> once near app root */}
      <Toaster toaster={toaster} />

      {/* 2. Trigger toasts from anywhere */}
      {toaster.create({
        action,
        description,
        label,
        type,
      })}
    </>
  ),
  props: {
    action: figma.boolean("button", {
      true: {label: "Action", onClick: () => {}},
    }),
    description: figma.string("description"),
    label: figma.string("heading"),
    type: figma.enum<ToastType>("emphasis", {
      danger: "danger",
      neutral: "neutral",
      success: "success",
      warning: "warning",
    }),
  },
})
