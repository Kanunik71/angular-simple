import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-form',
  imports: [ReactiveFormsModule],
  host: { class: 'ui-form' },
  templateUrl: './ui-form.html',
  styleUrl: './ui-form.scss',
})
export class UiForm {
  readonly formGroup = input.required<FormGroup>();
  readonly submitted = output<void>();
}
