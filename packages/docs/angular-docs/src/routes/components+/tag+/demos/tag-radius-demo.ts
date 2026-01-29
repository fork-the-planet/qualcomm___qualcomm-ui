import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-radius-demo",

  template: `
    <div class="flex flex-col gap-2">
      <!-- preview -->
      <span q-tag radius="square">Label</span>
      <span q-tag radius="rounded">Label</span>
      <!-- preview -->
    </div>
  `,
})
export class TagRadiusDemo {}
