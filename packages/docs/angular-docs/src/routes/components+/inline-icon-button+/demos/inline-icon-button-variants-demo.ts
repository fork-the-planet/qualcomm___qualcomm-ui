import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "inline-icon-button-contrast-demo",
  template: `
    <div class="flex flex-col items-center justify-center gap-3">
      <!-- preview -->
      <button aria-label="Close" q-inline-icon-button></button>
      <!-- preview -->
      <div class="bg-persistent-white p-2">
        <!-- preview -->
        <button
          aria-label="Close"
          emphasis="persistent-black"
          q-inline-icon-button
        ></button>
        <!-- preview -->
      </div>
      <div class="bg-persistent-black p-2">
        <!-- preview -->
        <button
          aria-label="Close"
          emphasis="persistent-white"
          q-inline-icon-button
        ></button>
        <!-- preview -->
      </div>
    </div>
  `,
})
export class InlineIconButtonVariantsDemo {}
