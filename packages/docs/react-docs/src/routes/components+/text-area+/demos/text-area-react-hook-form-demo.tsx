import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {TextArea} from "@qualcomm-ui/react/text-area"

interface FormData {
  feedback: string
}

const FormSchema = type({
  feedback: type("string>=10").configure({
    message: "Feedback must be at least 10 characters long",
  }),
})

export function TextAreaReactHookFormDemo() {
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {feedback: ""},
    resolver: arktypeResolver(FormSchema),
  })

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
      noValidate
      onSubmit={(e) => {
        void handleSubmit((data) => console.log(data))(e)
      }}
    >
      <Controller
        control={control}
        name="feedback"
        render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
          <TextArea
            className="w-full"
            counter
            errorText={error?.message}
            hint="Minimum 10 characters"
            invalid={!!error}
            label="Feedback"
            onValueChange={onChange}
            placeholder="Tell us about your experience"
            required
            {...fieldProps}
          />
        )}
      />

      <div className="flex w-full justify-end">
        <Button emphasis="primary" type="submit" variant="fill">
          Send Feedback
        </Button>
      </div>
    </form>
  )
}
