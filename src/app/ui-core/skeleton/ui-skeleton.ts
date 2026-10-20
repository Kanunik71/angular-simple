import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  host: {
    class: 'ui-skeleton',
    '[class.ui-skeleton--circle]': "variant() === 'circle'",
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    'aria-hidden': 'true',
  },
  template: '',
  styleUrl: './ui-skeleton.scss',
})
export class UiSkeleton {
  readonly width = input('100%');
  readonly height = input('16px');
  readonly variant = input<'text' | 'block' | 'circle'>('block');
}
