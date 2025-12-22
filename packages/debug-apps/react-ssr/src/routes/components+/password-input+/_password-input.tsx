import {PasswordInputCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-composite-demo"
import {PasswordInputControlledValueDemo as ControlledValueDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-controlled-value-demo"
import {PasswordInputControlledVisibilityDemo as ControlledVisibilityDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-controlled-visibility-demo"
import {PasswordInputIconsDemo as IconsDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-icons-demo"
import {PasswordInputReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-react-hook-form-demo"
import {PasswordInputSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-simple-demo"
import {PasswordInputTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-tanstack-form-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledValueDemo, title: "Controlled Value"},
  {component: ControlledVisibilityDemo, title: "Controlled Visibility"},
  {component: IconsDemo, title: "Icons"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function PasswordInputDemos() {
  return (
    <div className="page">
      {demos.map(({component: Demo, title}) => (
        <div className="section" key={title}>
          <h2 className="section-title">{title}</h2>
          <div className="demo-container">
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
