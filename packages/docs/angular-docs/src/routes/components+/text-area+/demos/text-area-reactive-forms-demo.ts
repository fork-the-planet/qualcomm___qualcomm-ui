import {Component, inject, signal} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, ButtonModule, ReactiveFormsModule],
  selector: "text-area-reactive-forms-demo",
  template: `
    <form
      class="mx-auto flex w-72 flex-col gap-3"
      [formGroup]="feedbackForm"
      (ngSubmit)="onSubmit()"
    >
      <q-text-area
        class="w-full"
        errorText="Feedback must be at least 10 characters long"
        formControlName="feedback"
        hint="Minimum 10 characters"
        label="Feedback"
        placeholder="Tell us about your experience"
        [invalid]="isFieldInvalid('feedback')"
      />

      <div class="flex w-full justify-end">
        <button
          emphasis="primary"
          q-button
          type="submit"
          variant="fill"
          [disabled]="isSubmitting()"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  `,
})
export class TextAreaReactiveFormsDemo {
  private fb = inject(FormBuilder)

  readonly isSubmitting = signal(false)

  feedbackForm = this.fb.group({
    feedback: ["", [Validators.required, Validators.minLength(10)]],
  })

  isFieldInvalid(fieldName: string): boolean {
    const field = this.feedbackForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isSubmitting.set(true)
      console.log("Form submitted:", this.feedbackForm.value)
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false)
      }, 1000)
    } else {
      // Mark all fields as touched to show validation errors
      this.feedbackForm.markAllAsTouched()
    }
  }
}
