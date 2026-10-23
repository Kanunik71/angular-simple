import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-modal',
  imports: [CdkTrapFocus],
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
