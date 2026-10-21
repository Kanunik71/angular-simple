import { Routes } from '@angular/router';

import { UsersRouteEnum } from '../../core/router/users-route.enum';
import { UserCreateUpdatePage } from './user-create-update-page/user-create-update-page';
import { UsersPage } from './users-page/users-page';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: UsersRouteEnum.List, component: UsersPage },
      { path: UsersRouteEnum.New, component: UserCreateUpdatePage },
      { path: UsersRouteEnum.Edit, component: UserCreateUpdatePage },
    ],
  },
];
