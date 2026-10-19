import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { allRoutes } from '../router/all-routes';
import { RouterService } from '../router/router.service';
import { AuthState } from './auth.state';
import { TokenStorage } from './token.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStorage);
  const auth = inject(AuthState);
  const router = inject(RouterService);
  const token = tokens.read();
  const authorized = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/api/auth/login')
      ) {
        auth.logout();
        void router.go(allRoutes.login());
      }
      return throwError(() => error);
    }),
  );
};
