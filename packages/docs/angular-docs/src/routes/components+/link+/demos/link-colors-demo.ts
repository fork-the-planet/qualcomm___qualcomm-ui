import {Component} from "@angular/core"

import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [LinkDirective],
  selector: "link-colors-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <a q-link>default</a>
      <a emphasis="neutral" q-link>neutral</a>
      <a emphasis="brand" q-link>brand</a>
      <div class="bg-persistent-black p-4">
        <a emphasis="white-persistent" q-link>white-persistent</a>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class LinkColorsDemo {}
