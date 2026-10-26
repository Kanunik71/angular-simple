import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UiButton } from '../../common/button/ui-button';
import { MODAL_REF } from '../../../services/modal/modal-ref';
import { UiModal } from '../ui-modal';

export interface UiConfirmModalConfig {
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmLabelKey?: string;
  cancelLabelKey?: string;
  variant?: 'primary' | 'danger';
}

@Component({
  selector: 'ui-confirm-modal',
  imports: [TranslatePipe, UiButton, UiModal],
  host: { class: 'ui-confirm-modal', 'data-testid': 'confirm-modal' },
  templateUrl: './ui-confirm-modal.html',
  styleUrl: './ui-confirm-modal.scss',
})
export class UiConfirmModal {
  readonly titleKey = input.required<string>();
  readonly messageKey = input.required<string>();
  readonly messageParams = input<Record<string, unknown> | undefined>(undefined);
  readonly confirmLabelKey = input('common.confirm');
  readonly cancelLabelKey = input('common.cancel');
  readonly variant = input<'primary' | 'danger'>('primary');

  private readonly ref = inject(MODAL_REF);

  protected close(confirmed: boolean): void {
    this.ref.close(confirmed);
  }
}
