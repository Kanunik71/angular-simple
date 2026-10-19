import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { RU } from './ru';

@Injectable({ providedIn: 'root' })
export class StaticTranslateLoader extends TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of(RU);
  }
}
