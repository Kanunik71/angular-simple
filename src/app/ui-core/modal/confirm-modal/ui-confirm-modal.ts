import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UiButton } from '../../common/button/ui-button';
import { MODAL_REF } from '../modal-ref';
import { UiModal } from '../ui-modal';

export interface UiConfirmModalConfig {
  title: string;
  message: string;
  messageParams?: Record<string, unknown>;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
}

@Component({
  selector: 'ui-confirm-modal',
  imports: [TranslatePipe, UiButton, UiModal],
  host: { class: 'ui-confirm-modal' },
  templateUrl: './ui-confirm-modal.html',
  styleUrl: './ui-confirm-modal.scss',
})
export class UiConfirmModal {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly messageParams = input<Record<string, unknown> | undefined>(undefined);
  readonly confirmLabel = input('common.confirm');
  readonly cancelLabel = input('common.cancel');
  readonly variant = input<'primary' | 'danger'>('primary');

  private readonly ref = inject(MODAL_REF);

  protected close(confirmed: boolean): void {
    this.ref.close(confirmed);
  }
}
