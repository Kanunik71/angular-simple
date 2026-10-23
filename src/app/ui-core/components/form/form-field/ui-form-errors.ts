import { Component, effect, inject, input, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ui-form-errors',
  host: { class: 'ui-form-errors' },
  templateUrl: './ui-form-errors.html',
  styleUrl: './ui-form-errors.scss',
})
export class UiFormErrors {
  readonly control = input<AbstractControl | null>(null);
  readonly labelKey = input.required<string>();

  private readonly translate = inject(TranslateService);
  protected readonly message = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const labelKey = this.labelKey();

      if (!control) {
        this.message.set(null);
        return;
      }

      const update = () => this.message.set(this.resolve(control, labelKey));
      update();

      const subscription = control.events.subscribe(update);
      onCleanup(() => subscription.unsubscribe());
    });
  }

  private resolve(control: AbstractControl, labelKey: string): string | null {
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['email']) {
      return this.translate.instant('errors.email');
    }

    if (control.errors['required']) {
      return this.translate.instant('errors.required', {
        label: this.translate.instant(labelKey),
      });
    }

    return this.translate.instant('errors.invalid');
  }
}
