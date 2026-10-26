import { Component, input } from '@angular/core';

@Component({
  selector: 'button[uiButton]',
  host: {
    class: 'ui-button',
    '[class.ui-button--full]': 'fullWidth()',
    '[class.ui-button--secondary]': 'variant() === "secondary"',
    '[class.ui-button--ghost]': 'variant() === "ghost"',
    '[class.ui-button--danger]': 'variant() === "danger"',
  },
  template: '<ng-content />',
  styleUrl: './ui-button.scss',
})
export class UiButton {
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  readonly fullWidth = input(false);
}
