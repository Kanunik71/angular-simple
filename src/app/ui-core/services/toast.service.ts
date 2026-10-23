import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ApiError } from '../../utils/http/api-error';

export type ToastVariant = 'info' | 'error' | 'success';

export interface ToastType {
  id: number;
  variant: ToastVariant;
  message: string;
}

const TOAST_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toastsState = signal<readonly ToastType[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly toasts = this.toastsState.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers.clear();
    });
  }

  info(message: string): void {
    this.show('info', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  fromError(error: unknown, fallbackKey: string): string {
    const message = this.translate.instant(ApiError.code(error) ?? fallbackKey);

    console.error(error);
    this.error(message);
    return message;
  }

  success(message: string): void {
    this.show('success', message);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(variant: ToastVariant, message: string): void {
    const toast: ToastType = {
      id: ++this.nextId,
      variant,
      message,
    };

    this.toastsState.update((toasts) => [...toasts, toast]);
    this.timers.set(
      toast.id,
      setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS),
    );
  }
}
