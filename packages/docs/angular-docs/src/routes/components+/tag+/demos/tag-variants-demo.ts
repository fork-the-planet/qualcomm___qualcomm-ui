import {Component} from "@angular/core"
import {Link2} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({Link2})],
  selector: "tag-variants-demo",

  template: `
    <div class="flex flex-col items-start gap-2">
      <!-- preview -->
      <button endIcon="Link2" q-tag variant="link">link</button>
      <button q-tag variant="selectable">selectable</button>
      <span q-tag variant="dismissable">dismissable</span>
      <!-- preview -->
    </div>
  `,
})
export class TagVariantsDemo {}
