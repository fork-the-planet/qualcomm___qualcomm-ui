// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"
import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {Link} from "@qualcomm-ui/react/link"

figma.connect(
  InlineNotification,
  "<FIGMA_COMPONENTS_BASE>?node-id=3598-17285",
  {
    example: ({dismissable, emphasis, inlineContent}) => {
      return (
        <InlineNotification
          action={inlineContent.action}
          description={inlineContent.description}
          dismissable={dismissable}
          emphasis={emphasis}
          label={inlineContent.heading}
          orientation={inlineContent.orientation}
        />
      )
    },
    props: {
      dismissable: figma.enum("dismiss", {
        true: true,
      }),
      emphasis: figma.enum<QdsNotificationEmphasis>("emphasis", {
        danger: "danger",
        info: "info",
        neutral: "neutral",
        success: "success",
        warning: "warning",
      }),
      inlineContent: figma.nestedProps("_Inline content", {
        action: figma.boolean("showLink", {
          true: <Link>Action</Link>,
        }),
        description: figma.boolean("description", {
          true: figma.string("descriptionText"),
        }),
        heading: figma.string("heading"),
        orientation: figma.enum("orientation", {
          vertical: "vertical",
        }),
      }),
    },
  },
)
