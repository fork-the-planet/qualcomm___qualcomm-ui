import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "app-preview-a",
  template: `
    <!-- [!code highlight] -->
    <div>
      <!-- preview -->
      <button q-button>Preview</button>
      <!-- preview -->
    </div>
  `,
})
export class PreviewADemo {}
