import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {TextArea} from "@qualcomm-ui/react/text-area"

interface FeedbackFormData {
  feedback: string
}

export function TextAreaTanstackFormDemo() {
  const form = useForm({
    defaultValues: {
      feedback: "",
    } satisfies FeedbackFormData,
    onSubmit: ({value}) => {
      // Handle successful submission
      console.log("Form submitted:", value)
    },
  })

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="feedback"
        validators={{
          onChange: ({value}) => {
            if (!value || value.trim().length < 10) {
              return "Feedback must be at least 10 characters long"
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <TextArea
            className="w-full"
            counter
            errorText={field.state.meta.errors?.[0]}
            hint="Minimum 10 characters"
            invalid={field.state.meta.errors.length > 0}
            label="Feedback"
            name={field.name}
            onBlur={field.handleBlur}
            onValueChange={field.handleChange}
            placeholder="Tell us about your experience"
            value={field.state.value}
          />
        )}
      </form.Field>

      <div className="flex w-full justify-end">
        <Button
          disabled={form.state.isSubmitting}
          emphasis="primary"
          type="submit"
          variant="fill"
        >
          Send Feedback
        </Button>
      </div>
    </form>
  )
}
