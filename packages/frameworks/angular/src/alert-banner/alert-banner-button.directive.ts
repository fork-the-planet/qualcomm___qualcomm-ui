import {computed, Directive, inject, type OnInit} from "@angular/core"

import {useButtonApi} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {resolveAlertBannerButtonProps} from "@qualcomm-ui/qds-core/alert-banner"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

/**
 * @since 2.6.0
 */
@Directive({
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(AlertBannerButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonApi()().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(AlertBannerButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonApi()().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-alert-banner-button]",
  standalone: false,
})
export class AlertBannerButtonDirective implements OnInit {
  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly buttonApi = computed(() =>
    useButtonApi({
      ...resolveAlertBannerButtonProps({
        emphasis: this.qdsContext().emphasis,
        variant: this.qdsContext().variant,
      }),
    }),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.qdsContext().getActionBindings(),
      this.buttonApi()().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
