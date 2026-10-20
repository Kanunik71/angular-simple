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
  readonly label = input.required<string>();
  readonly errorId = input<string | null>(null);

  private readonly translate = inject(TranslateService);
  protected readonly message = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const label = this.label();

      if (!control) {
        this.message.set(null);
        return;
      }

      const update = () => this.message.set(this.resolve(control, label));
      update();

      const subscription = control.events.subscribe(update);
      onCleanup(() => subscription.unsubscribe());
    });
  }

  private resolve(control: AbstractControl, label: string): string | null {
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['email']) {
      return this.translate.instant('errors.email');
    }

    if (control.errors['required']) {
      return this.translate.instant('errors.required', {
        label: this.translate.instant(label),
      });
    }

    return this.translate.instant('errors.invalid');
  }
}
