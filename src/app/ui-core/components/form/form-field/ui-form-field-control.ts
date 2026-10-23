import { InjectionToken } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface UiFormFieldControl {
  readonly fieldId: string;
  readonly control: AbstractControl | null;
}

export const UI_FORM_FIELD_CONTROL = new InjectionToken<UiFormFieldControl>(
  'UI_FORM_FIELD_CONTROL',
);
