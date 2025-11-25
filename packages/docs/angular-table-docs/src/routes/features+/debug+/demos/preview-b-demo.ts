import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "app-preview-b",
  template: `
    <!-- preview -->
    <div>
      <!-- [!code focus] -->
      <button q-button>Preview</button>
    </div>
    <!-- preview -->
  `,
})
export class PreviewBDemo {}
