import { AppRouteEnum } from './app-route.enum';
import { UsersRouteEnum } from './users-route.enum';

export const allRoutes = {
  login: (): string => `/${AppRouteEnum.Login}`,
  users: {
    list: (): string => `/${AppRouteEnum.Users}`,
    new: (): string => `/${AppRouteEnum.Users}/${UsersRouteEnum.New}`,
    edit: (id: string): string => fill(`/${AppRouteEnum.Users}/${UsersRouteEnum.Edit}`, { id }),
  },
} as const;

function fill(path: string, params: Record<string, string>): string {
  return path.replace(/:([^/]+)/g, (match, key: string) =>
    params[key] ? encodeURIComponent(params[key]) : match,
  );
}
