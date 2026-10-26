import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiAlert } from './ui-alert';

const meta: Meta<UiAlert> = {
  title: 'UI Core/Common/Alert',
  component: UiAlert,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-alert [variant]="variant">Не удалось загрузить пользователей</ui-alert>`,
  }),
  args: {
    variant: 'error',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<UiAlert>;

export const Error: Story = {};
export const Info: Story = { args: { variant: 'info' } };
