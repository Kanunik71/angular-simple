export type ApiErrorCodeEnum =
  | 'apiErrors.routeNotFound'
  | 'apiErrors.unauthorized'
  | 'apiErrors.loginRequired'
  | 'apiErrors.invalidCredentials'
  | 'apiErrors.userNotFound'
  | 'apiErrors.userNameRequired'
  | 'apiErrors.userEmailInvalid'
  | 'apiErrors.userRoleRequired'
  | 'apiErrors.userEmailTaken';

export interface ApiErrorBodyModel {
  code: string;
}
