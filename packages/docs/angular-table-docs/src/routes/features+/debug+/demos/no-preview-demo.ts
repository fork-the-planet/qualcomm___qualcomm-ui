import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "app-no-preview",
  template: `
    <div>
      <button q-button>Preview</button>
    </div>
  `,
})
export class NoPreviewDemo {}
