import { applicationConfig, type Preview } from '@storybook/angular-vite';

import { provideAppTranslate } from '../src/app/i18n/translate.config';

import '@angular/cdk/overlay-prebuilt.css';
import '../src/styles.scss';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [...provideAppTranslate()],
    }),
  ],
};

export default preview;
