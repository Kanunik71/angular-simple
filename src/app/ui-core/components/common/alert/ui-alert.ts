import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-alert',
  host: {
    class: 'ui-alert',
    '[class.ui-alert--error]': 'variant() === "error"',
    '[class.ui-alert--info]': 'variant() === "info"',
  },
  template: '<ng-content />',
  styleUrl: './ui-alert.scss',
})
export class UiAlert {
  readonly variant = input<'error' | 'info'>('error');
}
