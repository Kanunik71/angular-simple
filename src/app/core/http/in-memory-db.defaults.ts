import type { UserResponseModel } from '../../models/user/user-response.models';

export const DEFAULT_USERS: readonly UserResponseModel[] = [
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
