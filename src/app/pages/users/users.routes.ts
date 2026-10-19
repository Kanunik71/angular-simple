import { Routes } from '@angular/router';

import { UsersRouteEnum } from '../../core/router/users-route.enum';
import { UserFormPage } from './user-form-page/user-form-page';
import { UsersPage } from './users-page/users-page';
import { UsersState } from './users.state';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [UsersState],
    children: [
      { path: UsersRouteEnum.List, component: UsersPage },
      { path: UsersRouteEnum.New, component: UserFormPage },
      { path: UsersRouteEnum.Edit, component: UserFormPage },
    ],
  },
];
