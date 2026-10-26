import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, catchError } from 'rxjs';

import { UserDraftModel } from '../../../models/user/user.models';
import { UserRoleEnum } from '../../../models/user/user-role.models';
import { LoaderState } from '../../../core/state/loader.state';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../../ui-core/services/toast.service';
import { FormValidators } from '../../../utils/forms/form.validators';
import type { UserCreateUpdateFormGroup } from '../../../entities/user/user-create-update-form/user-create-update-form';

@Injectable()
export class UserCreateUpdatePageState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toast = inject(ToastService);

  readonly loader = new LoaderState();
  readonly saved = signal(0);
  readonly form: UserCreateUpdateFormGroup = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [FormValidators.requiredTrim] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim, FormValidators.emailFormat],
    }),
    role: new FormControl<UserRoleEnum>('user', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim],
    }),
  });

  private id: string | null = null;

  init(id: string | null): void {
    this.id = id;
    this.loader.reset();
    this.form.reset({ fullName: '', email: '', role: 'user' });

    if (!id) {
      return;
    }

    this.loader
      .load(() => this.service.get(id), {
        errorMessage: (error) => this.toast.fromError(error, 'users.loadUserError'),
      })
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) =>
        this.form.reset({
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        }),
      );
  }

  save(): void {
    if (this.loader.loading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const draft: UserDraftModel = {
      fullName: value.fullName.trim(),
      email: value.email.trim(),
      role: value.role,
    };
    const id = this.id;
    const request = id ? this.service.update(id, draft) : this.service.create(draft);

    this.loader
      .run(() => request, {
        errorMessage: (error) => this.toast.fromError(error, 'users.saveError'),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toast.success(this.translate.instant(id ? 'users.updated' : 'users.created'));
        this.saved.update((count) => count + 1);
      });
  }
}
