import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { CdkListbox, CdkOption, type ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  Component,
  Injector,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UiIcon } from '../../common/icon/ui-icon';
import { UI_FORM_FIELD_CONTROL } from '../form-field/ui-form-field-control';

export interface UiSelectOption {
  value: string;
  labelKey: string;
}

let nextFieldId = 0;

@Component({
  selector: 'ui-select',
  host: { class: 'ui-field' },
  templateUrl: './ui-select.html',
  styleUrls: ['../field/ui-field.scss', './ui-select.scss'],
  imports: [CdkConnectedOverlay, CdkListbox, CdkOption, CdkOverlayOrigin, TranslatePipe, UiIcon],
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
  protected readonly open = signal(false);
  protected readonly positions = STANDARD_DROPDOWN_BELOW_POSITIONS;
  protected readonly selectedOption = computed(
    () => this.options().find((option) => option.value === this.value()) ?? null,
  );
  protected readonly listboxValue = computed(() => {
    const value = this.value();
    return this.options().some((option) => option.value === value) ? [value] : [];
  });
  readonly fieldId = `ui-select-${nextFieldId++}`;

  private readonly controlState = signal<AbstractControl | null>(null);
  private readonly injector = inject(Injector);
  private readonly listbox = viewChild(CdkListbox);
  private readonly origin = viewChild(CdkOverlayOrigin);
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
    if (isDisabled) {
      this.open.set(false);
    }
  }

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }

    if (this.open()) {
      this.close();
    } else {
      this.open.set(true);
    }
  }

  protected close(restoreFocus = false): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    this.onTouched();

    if (restoreFocus) {
      this.origin()?.elementRef.nativeElement.focus();
    }
  }

  protected onAttach(): void {
    setTimeout(() => this.listbox()?.focus());
  }

  protected onDetach(): void {
    this.open.set(false);
  }

  protected onListboxValueChange(event: ListboxValueChangeEvent<string>): void {
    this.commit(event.value[0] ?? '');
  }

  protected onOptionClick(value: string): void {
    this.commit(value);
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    } else if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      this.close(true);
    }
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.open.set(true);
    }
  }

  protected onTriggerBlur(): void {
    if (!this.open()) {
      this.onTouched();
    }
  }

  private commit(value: string): void {
    if (value !== this.value()) {
      this.value.set(value);
      this.onChange(value);
    }

    this.close(true);
  }
}
