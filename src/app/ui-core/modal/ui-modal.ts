import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

let nextModalId = 0;

@Component({
  selector: 'ui-modal',
  imports: [CdkTrapFocus, TranslatePipe],
  templateUrl: './ui-modal.html',
  styleUrl: './ui-modal.scss',
})
export class UiModal {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  protected readonly titleId = `ui-modal-title-${nextModalId++}`;

  protected requestClose(): void {
    this.closed.emit();
  }
}
