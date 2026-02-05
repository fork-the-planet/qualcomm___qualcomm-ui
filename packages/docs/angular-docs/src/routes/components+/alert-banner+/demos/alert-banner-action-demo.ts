import {Component} from "@angular/core"

import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [AlertBannerModule, ButtonModule],
  selector: "alert-banner-action-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <!-- preview -->
      <div
        description="Use white-persistent emphasis for strong variant"
        heading="Strong"
        q-alert-banner
        variant="strong"
      >
        <button
          emphasis="white-persistent"
          q-alert-banner-action
          q-button
          size="sm"
          variant="outline"
        >
          Take action
        </button>
      </div>

      <div
        description="Use neutral emphasis for subtle variant"
        heading="Subtle"
        q-alert-banner
        variant="subtle"
      >
        <button
          emphasis="neutral"
          q-alert-banner-action
          q-button
          size="sm"
          variant="outline"
        >
          Take action
        </button>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AlertBannerActionDemo {}
