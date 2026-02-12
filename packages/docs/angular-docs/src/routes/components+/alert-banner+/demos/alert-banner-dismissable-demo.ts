import {Component} from "@angular/core"

import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [AlertBannerModule, ButtonModule],
  selector: "alert-banner-dismissable-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <!-- preview -->
      @if (simpleVisible) {
        <div
          closeButtonAriaLabel="Close this banner"
          dismissable
          heading="Simple API"
          q-alert-banner
          (closed)="simpleVisible = false"
        ></div>
      }

      @if (compositeVisible) {
        <div
          closeButtonAriaLabel="Close this banner"
          q-alert-banner-root
          variant="subtle"
          (closed)="compositeVisible = false"
        >
          <span q-alert-banner-icon></span>
          <div q-alert-banner-heading>Composite API</div>
          <button q-alert-banner-close-button></button>
        </div>
      }
      <!-- preview -->

      @if (!simpleVisible && !compositeVisible) {
        <button q-button (click)="reset()">Reset demo</button>
      }
    </div>
  `,
})
export class AlertBannerDismissableDemo {
  simpleVisible = true
  compositeVisible = true

  reset() {
    this.simpleVisible = true
    this.compositeVisible = true
  }
}
