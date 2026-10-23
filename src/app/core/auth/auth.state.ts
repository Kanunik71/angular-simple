import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { SessionObject } from '../../models/auth/auth.models';
import { ApiError } from '../../utils/http/api-error';
import { Jwt } from '../../utils/jwt/jwt';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly service = inject(AuthService);
  private readonly tokens = inject(TokenStorage);
  private readonly translate = inject(TranslateService);

  readonly session = signal<SessionObject | null>(this.restore());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(username: string, password: string): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.service
      .login({ username, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => {
          this.tokens.write(session.token);
          this.session.set(session);
        },
        error: (error: unknown) => {
          this.error.set(this.translate.instant(ApiError.code(error) ?? 'errors.login'));
        },
      });
  }

  logout(): void {
    this.tokens.clear();
    this.session.set(null);
    this.error.set(null);
  }

  private restore(): SessionObject | null {
    const token = this.tokens.read();
    if (!token) {
      return null;
    }

    const payload = Jwt.readPayload(token);
    if (!payload) {
      this.tokens.clear();
      return null;
    }

    return new SessionObject(payload.sub, payload.role, token);
  }
}
