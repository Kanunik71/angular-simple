import { Injectable } from '@angular/core';

import { UserResponseType } from '../../models/user/user-response.models';

@Injectable({ providedIn: 'root' })
export class InMemoryDb {
  readonly users: UserResponseType[] = [
    {
      id: 'u-1',
      fullName: 'Анна Смирнова',
      email: 'anna@example.com',
      role: 'admin',
    },
    {
      id: 'u-2',
      fullName: 'Илья Орлов',
      email: 'ilya@example.com',
      role: 'user',
    },
    {
      id: 'u-3',
      fullName: 'Мария Козлова',
      email: 'maria@example.com',
      role: 'user',
    },
  ];
}
