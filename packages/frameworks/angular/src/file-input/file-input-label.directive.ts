// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreFileUploadLabelDirective} from "@qualcomm-ui/angular-core/file-upload"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-file-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (fileUploadContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class FileInputLabelDirective extends CoreFileUploadLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsInputContext().getLabelBindings()),
    )
  }
}
