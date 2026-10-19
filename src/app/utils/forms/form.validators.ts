import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class FormValidators {
  static requiredTrim(control: AbstractControl): ValidationErrors | null {
    const value: unknown = control.value;
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { required: true };
    }
    return null;
  }

  static emailFormat(control: AbstractControl): ValidationErrors | null {
    const value: unknown = control.value;
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return EMAIL_PATTERN.test(value.trim()) ? null : { email: true };
  }
}
