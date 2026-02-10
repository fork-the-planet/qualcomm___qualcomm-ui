import {Component} from "@angular/core"

import {AvatarContentDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-content-demo"
import {AvatarEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-emphasis-demo"
import {AvatarShowcaseDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-showcase-demo"
import {AvatarSizeDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-size-demo"
import {AvatarStateCallbackDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-state-callback-demo"
import {AvatarStatusDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-status-demo"

@Component({
  imports: [
    AvatarContentDemo,
    AvatarEmphasisDemo,
    AvatarShowcaseDemo,
    AvatarSizeDemo,
    AvatarStateCallbackDemo,
    AvatarStatusDemo,
  ],
  selector: "app-avatar",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Content</h2>
        <div class="demo-container">
          <avatar-content />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <avatar-emphasis />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <avatar-showcase />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <avatar-size />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">State Callback</h2>
        <div class="demo-container">
          <avatar-state-callback />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Status</h2>
        <div class="demo-container">
          <avatar-status />
        </div>
      </div>
    </div>
  `,
})
export class AvatarPage {}
