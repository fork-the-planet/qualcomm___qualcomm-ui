import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "app-preview-b",
  template: `
    <div>
      <button q-button>{{ value() }}</button>
    </div>
  `,
})
export class PreviewCDemo {
  // preview
  readonly value = signal<string>("Preview")
  // preview
}
