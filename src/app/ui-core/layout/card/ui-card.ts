import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  host: {
    class: 'ui-card',
    '[class.ui-card--flush]': 'flush()',
  },
  template: '<ng-content />',
  styleUrl: './ui-card.scss',
})
export class UiCard {
  readonly flush = input(false);
}
