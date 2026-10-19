import { Routes } from '@angular/router';

import { UserFormPage } from './user-form-page/user-form-page';
import { UsersPage } from './users-page/users-page';
import { UsersState } from './users.state';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [UsersState],
    children: [
      { path: '', component: UsersPage },
      { path: 'new', component: UserFormPage },
      { path: ':id/edit', component: UserFormPage },
    ],
  },
];
