import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';

import { UserDraftModel, UserRoleEnum } from '../../../models/user/user.models';
import { ComponentState } from '../../../core/state/component.state';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../../ui-core/common/toast/toast.service';
import { FormValidators } from '../../../utils/forms/form.validators';
import { ApiError } from '../../../utils/http/api-error';
import type { UserCreateUpdateFormGroup } from '../../../entities/user/user-create-update-form/user-create-update-form';

@Injectable()
export class UserCreateUpdatePageState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toast = inject(ToastService);

  readonly page = new ComponentState();
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
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
    this.formError.set(null);
    this.page.reset();
    this.form.reset({ fullName: '', email: '', role: 'user' });

    if (!id) {
      return;
    }

    this.page
      .load(() => this.service.get(id), {
        errorMessage: (error) => this.userErrorMessage(error),
      })
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        if (!user) {
          return;
        }

        this.form.reset({
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        });
      });
  }

  save(draft: UserDraftModel): void {
    if (this.saving()) {
      return;
    }

    const id = this.id;
    this.saving.set(true);
    this.formError.set(null);
    const request = id ? this.service.update(id, draft) : this.service.create(draft);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(this.translate.instant(id ? 'users.updated' : 'users.created'));
        this.saved.update((count) => count + 1);
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.formError.set(
          this.notifyError(
            error,
            ApiError.message(error, this.translate.instant('users.saveError')),
          ),
        );
        this.saving.set(false);
      },
    });
  }

  private userErrorMessage(error: unknown): string {
    const message =
      error instanceof HttpErrorResponse && error.status === 404
        ? this.translate.instant('userForm.notFound')
        : ApiError.message(error, this.translate.instant('users.loadUserError'));

    return this.notifyError(error, message);
  }

  private notifyError(error: unknown, message: string): string {
    console.error(error);
    this.toast.error(message);
    return message;
  }
}
