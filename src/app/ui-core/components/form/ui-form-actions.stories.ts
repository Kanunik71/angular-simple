import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiButton } from '../common/button/ui-button';
import { UiFormActions } from './ui-form-actions';

const meta: Meta<UiFormActions> = {
  title: 'UI Core/Form/Form Actions',
  component: UiFormActions,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiFormActions, UiButton] })],
  render: () => ({
    template: `
      <ui-form-actions>
        <button uiButton type="button">Сохранить</button>
        <button uiButton type="button" variant="secondary">Отмена</button>
      </ui-form-actions>
    `,
  }),
};

export default meta;
type Story = StoryObj<UiFormActions>;

export const Default: Story = {};
