import {Component, signal} from "@angular/core"
import {Check, Plus} from "lucide-angular"

import {TagDirective} from "@qualcomm-ui/angular/tag"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({Check, Plus})],
  selector: "tag-controlled-demo",
  template: `
    <div class="flex flex-col items-start gap-2">
      <!-- preview -->
      <button
        q-tag
        variant="selectable"
        [startIcon]="selected() ? 'Check' : 'Plus'"
        [(selected)]="selected"
      >
        {{ selected() ? "Subscribed" : "Subscribe" }}
      </button>
      <!-- preview -->
    </div>
  `,
})
export class TagControlledDemo {
  readonly selected = signal<boolean>(false)
}
