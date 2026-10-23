import { InjectionToken } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export class ModalRef<TResult = unknown> {
  private readonly closedSubject = new ReplaySubject<TResult | null>(1);
  private readonly onClose: () => void;
  private isClosed = false;

  readonly closed: Observable<TResult | null> = this.closedSubject.asObservable();

  constructor(onClose: () => void) {
    this.onClose = onClose;
  }

  close(result: TResult | null = null): void {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    this.closedSubject.next(result);
    this.closedSubject.complete();
    this.onClose();
  }
}

export const MODAL_REF = new InjectionToken<ModalRef<unknown>>('ModalRef');
