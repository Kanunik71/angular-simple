import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { Observable, filter, finalize, map } from 'rxjs';

import { UiConfirmModalConfig } from '../../components/modal/confirm-modal/ui-confirm-modal';
import { ModalRef } from './modal-ref';
import { ModalService } from './modal.service';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  private active: ModalRef<boolean> | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeActive());
  }

  ask(config: UiConfirmModalConfig): Observable<boolean> {
    this.closeActive();

    const ref = this.modal.confirm(config);
    this.active = ref;

    return ref.closed.pipe(
      map((value) => value === true),
      finalize(() => {
        if (this.active === ref) {
          this.active = null;
        }
      }),
    );
  }

  private closeActive(): void {
    this.active?.close(null);
    this.active = null;
  }
}
