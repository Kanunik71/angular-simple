import { Routes } from '@angular/router';

import { AppRouteEnum } from './core/router/app-route.enum';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { AppLayout } from './layout/app-layout/app-layout';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: AppRouteEnum.Users },
  {
    path: AppRouteEnum.Login,
    canActivate: [guestGuard],
    loadChildren: () => import('./pages/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: AppRouteEnum.Users,
        loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: AppRouteEnum.Users },
];
