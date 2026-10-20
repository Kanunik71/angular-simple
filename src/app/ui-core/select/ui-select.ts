import { Component, Injector, OnInit, forwardRef, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UI_FORM_FIELD_CONTROL } from '../form-field/ui-form-field-control';

export interface UiSelectOption {
  value: string;
  label: string;
}

let nextFieldId = 0;

@Component({
  selector: 'ui-select',
  host: { class: 'ui-field' },
  templateUrl: './ui-select.html',
  styleUrl: '../field/ui-field.scss',
  imports: [TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelect),
      multi: true,
    },
    {
      provide: UI_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => UiSelect),
    },
  ],
})
export class UiSelect implements ControlValueAccessor, OnInit {
  readonly options = input<UiSelectOption[]>([]);

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  readonly fieldId = `ui-select-${nextFieldId++}`;
  readonly errorId = `${this.fieldId}-error`;

  private readonly controlState = signal<AbstractControl | null>(null);
  private readonly injector = inject(Injector);
  private ngControl: NgControl | null = null;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get control(): AbstractControl | null {
    return this.controlState();
  }

  protected get invalid(): boolean {
    const control = this.control;
    return control !== null && control.invalid && control.touched;
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

  protected onSelect(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
