import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Type, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiConfirmModal, UiConfirmModalConfig } from './confirm-modal/ui-confirm-modal';
import { MODAL_REF, ModalRef } from './modal-ref';

export interface ModalConfig {
  inputs?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  open<TComponent, TResult = unknown>(
    component: Type<TComponent>,
    config: ModalConfig = {},
  ): ModalRef<TResult> {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'ui-modal-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });

    const subscriptions = new Subscription();
    const ref = new ModalRef<TResult>(() => {
      subscriptions.unsubscribe();
      overlayRef.dispose();
    });
    const injector = Injector.create({
      providers: [{ provide: MODAL_REF, useValue: ref }],
      parent: this.injector,
    });
    const componentRef = overlayRef.attach(new ComponentPortal(component, null, injector));

    for (const [name, value] of Object.entries(config.inputs ?? {})) {
      componentRef.setInput(name, value);
    }
    componentRef.changeDetectorRef.detectChanges();

    subscriptions.add(overlayRef.backdropClick().subscribe(() => ref.close(null)));
    subscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          ref.close(null);
        }
      }),
    );

    return ref;
  }

  confirm(config: UiConfirmModalConfig): ModalRef<boolean> {
    return this.open<UiConfirmModal, boolean>(UiConfirmModal, { inputs: { ...config } });
  }
}
