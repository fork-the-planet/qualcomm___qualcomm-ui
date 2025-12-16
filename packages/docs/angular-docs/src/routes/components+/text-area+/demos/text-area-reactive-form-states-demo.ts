import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, ReactiveFormsModule],
  selector: "text-area-reactive-form-states-demo",
  template: `
    <div class="flex w-72 flex-col gap-4">
      <q-text-area
        label="Disabled"
        placeholder="Disabled"
        [formControl]="disabledField"
      />
      <q-text-area
        label="Invalid"
        placeholder="Invalid"
        [formControl]="invalidField"
      />
      <q-text-area
        label="Required"
        placeholder="Required"
        [formControl]="requiredField"
      />
    </div>
  `,
})
export class TextAreaReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl("")
  invalidField = new FormControl("Too short", {
    validators: [Validators.required, Validators.minLength(10)],
  })
  requiredField = new FormControl("", {validators: [Validators.required]})

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
  // preview
}
