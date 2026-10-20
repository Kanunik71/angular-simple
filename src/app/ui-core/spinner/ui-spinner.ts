import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type UiSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-spinner',
  imports: [TranslatePipe],
  host: {
    class: 'ui-spinner',
    role: 'status',
    '[class.ui-spinner--overlay]': 'hasOverlay()',
    '[class.ui-spinner--sm]': "size() === 'sm'",
    '[class.ui-spinner--lg]': "size() === 'lg'",
  },
  template: `
    <span class="ui-spinner__circle" aria-hidden="true"></span>
    <span class="ui-spinner__label">{{ 'common.loading' | translate }}</span>
  `,
  styleUrl: './ui-spinner.scss',
})
export class UiSpinner {
  readonly hasOverlay = input(false);
  readonly size = input<UiSpinnerSize>('md');
}
