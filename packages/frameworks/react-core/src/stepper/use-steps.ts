import {
  createStepperApi,
  type StepperApiProps,
  stepperMachine,
} from "@qualcomm-ui/core/stepper"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"

export function useSteps(props: StepperApiProps) {
  const machine = useMachine(stepperMachine, props)
  const stepperApi = createStepperApi(machine, normalizeProps)
  return stepperApi
}
