import { EnvironmentProviders, Provider } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

import { APP_LANG } from './ru';
import { StaticTranslateLoader } from './static-translate-loader';

export function provideAppTranslate(): (Provider | EnvironmentProviders)[] {
  return provideTranslateService({
    loader: StaticTranslateLoader,
    lang: APP_LANG,
    fallbackLang: APP_LANG,
  });
}
