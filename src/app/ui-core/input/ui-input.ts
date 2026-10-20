import { Component, Injector, OnInit, forwardRef, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

import { UI_FORM_FIELD_CONTROL } from '../form-field/ui-form-field-control';

let nextFieldId = 0;

@Component({
  selector: 'ui-input',
  host: { class: 'ui-field' },
  templateUrl: './ui-input.html',
  styleUrl: '../field/ui-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true,
    },
    {
      provide: UI_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => UiInput),
    },
  ],
})
export class UiInput implements ControlValueAccessor, OnInit {
  readonly type = input<'text' | 'password' | 'email'>('text');
  readonly autocomplete = input<string | null>(null);

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  readonly fieldId = `ui-input-${nextFieldId++}`;

  private readonly controlState = signal<AbstractControl | null>(null);
  private readonly injector = inject(Injector);
  private ngControl: NgControl | null = null;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get control(): AbstractControl | null {
    return this.controlState();
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    this.controlState.set(this.ngControl?.control ?? null);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
