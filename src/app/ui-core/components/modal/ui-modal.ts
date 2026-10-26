import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, input, output } from '@angular/core';

import { UiIcon } from '../common/icon/ui-icon';

@Component({
  selector: 'ui-modal',
  imports: [CdkTrapFocus, UiIcon],
  templateUrl: './ui-modal.html',
  styleUrl: './ui-modal.scss',
})
export class UiModal {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  protected requestClose(): void {
    this.closed.emit();
  }
}
