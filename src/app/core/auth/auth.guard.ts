import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { allRoutes } from '../router/all-routes';
import { AuthState } from './auth.state';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthState);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl(allRoutes.login());
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthState);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.parseUrl(allRoutes.users.list()) : true;
};
