import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { MockBackend } from './core/http/mock-backend';
import { provideAppTranslate } from './i18n/translate.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    provideAppTranslate(),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: HttpBackend, useClass: MockBackend },
  ],
};
