import figma, {html} from "@figma/code-connect/html"

const sharedProps = {
  defaultInputValue: figma.boolean("filled", {
    true: figma.string("inputText"),
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.string("errorText"),
  hint: figma.string("helperText"),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  placeholder: figma.string("holderText"),
  required: figma.boolean("required"),
  size: figma.enum("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
  }),
}

figma.connect("<FIGMA_COMPONENTS_BASE>?node-id=4227-2418", {
  example: (props) => html`
    <!-- import {TextInputModule} from "@qualcomm-ui/angular/text-input" -->
    <q-text-input
      [disabled]="${props.disabled}"
      errorText="${props.errorText}"
      label="${props.label}"
      hint="${props.hint}"
      placeholder="${props.placeholder}"
      size="${props.size}"
    />
  `,
  props: {
    ...sharedProps,
    endIcon: figma.instance("iconRxs"),
    startIcon: figma.instance("iconLxs"),
  },
})
